# 업무 관리
from model import projectManageModel, memberManageModel
from sqlalchemy import desc, distinct
from fastapi import HTTPException
from datetime import datetime


def get_project_member(db, project_name):
    
    try:
        p_member_query = f'''SELECT name, section
        FROM members
        WHERE user_id = ANY(SELECT user_id 
        FROM groupware_project_members
        WHERE project_code = (SELECT project_code
        FROM groupware_project
        WHERE project_name = "{project_name}")) 
        '''
        project_member = db.execute(p_member_query).fetchall() 
        project_member = [(i[0]+'('+str(i[1])+')')for i in project_member] 
        
        return project_member
    
    except:
        raise HTTPException(status_code=500, detail='DBError')     


def get_project_name(db, user_id, is_admin):

    try:
        if is_admin == 'admin':
            # 전체 프로젝트명
            
            p_name_query = f'''
            SELECT project_name
            FROM groupware_project
            WHERE organ_code = (SELECT department_code 
            FROM members
            WHERE user_id = "{user_id}")
            '''
            
        if is_admin == 'guest': 
            # 자신이 속한 프로젝트명

            p_name_query = f'''
            SELECT project_name FROM groupware_project 
            WHERE project_code = ANY(SELECT project_code 
            FROM groupware_project_members WHERE user_id = "{user_id}")
            '''

        project_name = db.execute(p_name_query).fetchall()
        project_name = [name for name, in project_name]   

             
        return project_name
    
    except:
        raise HTTPException(status_code=500, detail='DBError')        
    
def get_project_list(db, offset, limit, user_id, *filter):

    project_manage_table = projectManageModel.ProjectManageTable
    project_table = projectManageModel.ProjectTable
    member_table = memberManageModel.MemberTable

    try:    
        user_organ_code = db.query(member_table.department_code).filter(member_table.user_id==user_id) # 기업코드 확인        
        
        query = db.query(project_manage_table.id,
                        project_manage_table.title,
                        project_table.project_name,
                        project_manage_table.content,
                        project_manage_table.request_id,
                        project_manage_table.manager_id,
                        project_manage_table.work_status,
                        project_manage_table.created_at,
                        project_manage_table.work_end_date
                        ).filter(project_table.organ_code==user_organ_code
                        ).join(project_table, project_manage_table.project_code == project_table.project_code).order_by(desc(project_manage_table.id))
                        
        if filter:
            if len(filter) != 1: # filter-read
                status_filter = filter[0].value                
                project_name = filter[1].project_name
                manager_id = filter[1].manager_id
                request_id = filter[1].request_id
                title = filter[1].title
                content = filter[1].content
                progress_status = filter[1].progress_status
                
                if project_name:
                    query = query.filter(project_table.project_name == project_name)
                if manager_id:
                    query = query.filter(project_manage_table.manager_id == manager_id)
                if request_id:  
                    query = query.filter(project_manage_table.request_id == request_id)
                if title:
                    query = query.filter(project_manage_table.title.ilike(f'%{title}%'))
                if content:
                    query = query.filter(project_manage_table.content.ilike(f'%{content}%'))
                if progress_status:
                    query = query.filter(project_manage_table.work_status.in_(progress_status))
                
            else: # read
                status_filter = filter[0]
             
            if status_filter:  
                # 유저 아이디로 유저 이름+ 부서명 추출 ex) 송모아나(SI팀)
                member_name = db.query(member_table.name, member_table.section).filter(member_table.user_id == user_id).all()
                member_name = [(i[0]+'('+str(i[1])+')')for i in member_name] 
                if status_filter == 'MyProject': # default
                    query = query.filter(project_manage_table.manager_id == member_name)
                elif status_filter == 'MyRequest':
                    query = query.filter(project_manage_table.request_id == member_name)
                    
        project_count = query.count()     
        project_list = query.offset(offset).limit(limit).all()
        
        return project_count, project_list
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail='DBError')    
    
def get_project_info(db, project_id):
    
    project_manage_table = projectManageModel.ProjectManageTable
    project_table = projectManageModel.ProjectTable
    
    try:
        project_info = db.query(project_manage_table.id,
                        project_manage_table.title,
                        project_manage_table.content,
                        project_table.project_name,
                        project_manage_table.request_id,
                        project_manage_table.manager_id,
                        project_manage_table.work_status,
                        project_manage_table.created_at,
                        project_manage_table.work_end_date
                        ).filter(project_manage_table.id == project_id
                        ).join(project_table, project_manage_table.project_code == project_table.project_code).order_by(desc(project_manage_table.id)).first()
                        
        return project_info
    
    except:
        raise HTTPException(status_code=500, detail='DBError')

def insert_project(db,inbound_data,user_id):
    
    project_manage_table = projectManageModel.ProjectManageTable
    project_table = projectManageModel.ProjectTable
    member_table = memberManageModel.MemberTable

    try:

        user_organ_code = db.query(member_table.department_code).filter(member_table.user_id == user_id).first()
        project_code = db.query(project_table.project_code).filter(project_table.project_name == inbound_data.project_name).first()
        
        db_query = project_manage_table(
            organ_code=user_organ_code[0],
            project_code=project_code[0],
            title=inbound_data.title,
            request_id=inbound_data.request_id,
            manager_id=inbound_data.manager_id,
            content=inbound_data.content,
            work_status=inbound_data.work_status,
            created_id=user_id)
        
        db.add(db_query)

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail='DBError')
    

def change_project(db,inbound_data, project_id, user_id):
    
    project_manage_table = projectManageModel.ProjectManageTable
    
    try:
        base_q = db.query(project_manage_table).filter(project_manage_table.id == project_id).first()
            
        values = {
                'request_id':inbound_data.request_id,
                'manager_id':inbound_data.manager_id,
                'work_status':inbound_data.work_status,
                'title':inbound_data.title,
                'content':inbound_data.content,
                'created_id':user_id,
                'updated_at':datetime.today()}
        
        if inbound_data.work_status == '완료':
            values['work_end_date'] = datetime.today()
        
        if user_id == base_q.created_id:
            db.query(project_manage_table).filter_by(id = project_id).update(values)
        else:
            raise HTTPException(status_code=422, detail='InvalidClient')
    except:
        raise HTTPException(status_code=500, detail='DBError')
    

def remove_project(db, notice_id, user_id):

    project_table = projectManageModel.ProjectManageTable
    
    try:
        base_q = db.query(project_table).filter(project_table.id == notice_id)
        if base_q.first().created_id == user_id:
            base_q.delete()
        else:
            raise HTTPException(status_code=422, detail='InvalidClient')
    except:
        raise HTTPException(status_code=500, detail='dbDeleteError')