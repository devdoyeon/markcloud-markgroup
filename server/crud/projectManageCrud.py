# 업무 관리
from model import projectManageModel, memberManageModel
from router import author_chk

from sqlalchemy import desc, distinct
from fastapi import HTTPException
from datetime import datetime

def get_project_member(db, user_info, inbound_filter): # 프로젝트 멤버
    
    member_table = memberManageModel.MemberTable

    try:
        if inbound_filter.project_name: # 프로젝트명이 들어왔을경우
            p_member_query = f'''SELECT id, name, section
            FROM members
            WHERE user_id = ANY(SELECT user_id 
            FROM groupware_project_members
            WHERE project_code = (SELECT project_code
            FROM groupware_project
            WHERE project_name = "{inbound_filter.project_name}")) 
            '''
            project_member = db.execute(p_member_query).fetchall() 

        else: # 기본
            project_member = db.query(member_table.id,
                                member_table.name,
                                member_table.section,
                                ).filter(member_table.department_code == user_info.department_code
                                ).all()

        if project_member == False:
            return 0
        
        project_member = {i[0]:i[1]+'('+str(i[2])+')' for i in project_member}
        return project_member
    
    except:
        raise HTTPException(status_code=500, detail='GetPjtMbError')     


def get_project_name(db, user_info): # 처음 렌더링할때 뿌려줘야하는 프로젝트명 데이터
    
    project_table = projectManageModel.ProjectTable

    try:

        # admin 계정일 경우 전체 프로젝트명 가져오기
        if user_info.groupware_only_yn == 'N': 
            all_pjt_name = db.query(project_table.project_name).filter(project_table.organ_code == user_info.department_code).all()
        
        else: 
            # 자신이 속한 프로젝트명 가져오기
            p_name_query = f'''
            SELECT project_name FROM groupware_project 
            WHERE project_code = ANY(SELECT project_code 
            FROM groupware_project_members WHERE user_id = "{user_info.user_id}")
            '''
            all_pjt_name = db.execute(p_name_query).fetchall()
        all_pjt_name = [name for name, in all_pjt_name] 
        return all_pjt_name
    except:
        raise HTTPException(status_code=500, detail='GetPjtNmError')            
    
def get_project_list(db, offset, limit, user_info, *filter):
    
    try:  
        query = f'''SELECT a.id,
                    a.title,
                    b.project_name,
                    a.content, 
                    (SELECT concat(name,'(',section,')') from members where a.request_id = members.id) as request_id,
                    (SELECT concat(name,'(',section,')') from members where a.manager_id = members.id) as manager_id,
                    a.work_status,
                    a.created_at,
                    a.work_end_date
                    FROM groupware_work_management as a
                    INNER JOIN groupware_project as b
                    ON a.project_code = b.project_code
                    WHERE b.organ_code = "{user_info.department_code}"
                    '''     
        
        status_filter = filter[0].value
        project_name = filter[1].project_name
        manager_id = filter[1].manager_id
        request_id = filter[1].request_id
        title = filter[1].title
        content = filter[1].content
        progress_status = filter[1].progress_status
            
        if status_filter == 'MyProject':
            query = query + f' AND a.manager_id = "{user_info.id}"'
        elif status_filter == 'MyRequest':
            query = query + f' AND a.request_id = "{user_info.id}"'
        if project_name:
            query = query + f' AND b.project_name = "{project_name}"'
        if manager_id:
            query = query + f' AND a.manager_id = "{manager_id}"'
        if request_id:
            query = query + f' AND a.request_id = "{request_id}"'
        if title:
            query = query + f' AND a.title LIKE "%{title}%"'
        if content:
            query = query + f' AND a.content LIKE "%{content}%"'
            
        if len(progress_status) == 1: #
            query = query + f'AND a.work_status = "{progress_status[0]}" '   
        else: 
            query = query + f'AND a.work_status IN {tuple(progress_status)} '     
        
        project_count = len(db.execute(query).fetchall())
        
        query = query + f' ORDER BY a.id DESC LIMIT {limit} OFFSET {offset}'
        project_list = db.execute(query).fetchall()


        return project_count, project_list
    except:
        raise HTTPException(status_code=500, detail='GetPjtError')   
    
        
    
def get_project_info(db, project_id,user_info):

    try:
        query = f'''
                    SELECT 
                    a.id, 
                    a.title, 
                    a.content,
                    b.project_name,
                    (SELECT CONCAT(name,'(',section,')') FROM members WHERE a.request_id = members.id) AS request_id,
                    (SELECT CONCAT(name,'(',section,')') FROM members WHERE a.manager_id = members.id) AS manager_id,
                    a.work_status,
                    a.created_at,
                    a.work_end_date
                    FROM groupware_work_management as a
                    INNER JOIN groupware_project as b
                    ON a.project_code = b.project_code
                    WHERE b.organ_code = "{user_info.department_code}"
                    AND a.id = {project_id}
                    '''
        project_info = db.execute(query).fetchall()

        return project_info
    
    except:
        raise HTTPException(status_code=500, detail='GetPjtInfoError')

def insert_project(db,inbound_data,user_info):
    
    project_manage_table = projectManageModel.ProjectManageTable
    project_table = projectManageModel.ProjectTable

    try:
        project_code = db.query(project_table.project_code).filter(project_table.project_name == inbound_data.project_name).first()
        
        db_query = project_manage_table(
            organ_code=user_info.department_code,
            project_code=project_code[0],
            title=inbound_data.title,
            request_id=inbound_data.request_id,
            manager_id=inbound_data.manager_id,
            content=inbound_data.content,
            work_status=inbound_data.work_status,
            created_id=user_info.id)
        
        db.add(db_query)

    except:
        raise HTTPException(status_code=500, detail='InsertPjtError')
    

def change_project(db,inbound_data, project_id, user_info):
    
    project_manage_table = projectManageModel.ProjectManageTable
    
    try:
        
        base_q = db.query(project_manage_table).filter(project_manage_table.id == project_id).first()
        
        values = {
                'request_id':inbound_data.request_id,
                'manager_id':inbound_data.manager_id,
                'work_status':inbound_data.work_status,
                'title':inbound_data.title,
                'content':inbound_data.content,
                'updated_at':datetime.today()}
        
        if inbound_data.work_status == '완료':
            values['work_end_date'] = datetime.today()
        
        if user_info.id == base_q.created_id or user_info.groupware_only_yn == 'N':
            db.query(project_manage_table).filter_by(id = project_id).update(values)
            
        else:
            raise HTTPException(status_code=422, detail='InvalidClient')
    except:
        raise HTTPException(status_code=500, detail='ChangePjtError')
    

def remove_project(db, notice_id, user_info):

    project_table = projectManageModel.ProjectManageTable
    
    try:
        base_q = db.query(project_table).filter(project_table.id == notice_id)
        if user_info.id == int(base_q.first().created_id) or user_info.groupware_only_yn == 'N':
            base_q.delete()
        else:
            raise HTTPException(status_code=422, detail='InvalidClient')
    except:
        raise HTTPException(status_code=500, detail='RemovePjtError')