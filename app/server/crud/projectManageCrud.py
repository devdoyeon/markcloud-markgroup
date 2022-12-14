# 업무 관리
from model import projectManageModel, memberManageModel
from sqlalchemy import desc
from fastapi import HTTPException
from datetime import datetime


def get_project_data(db,user_id):
    
    project_manage_table = projectManageModel.ProjectManageTable
    project_table = projectManageModel.ProjectTable
    member_table = memberManageModel.MemberTable    

    try:
        user_organ_code = db.query(member_table.department_code).filter(member_table.user_id==user_id).first()[0] # 기업코드 확인
        
        project_name = db.query(project_table.project_name).filter(project_manage_table.organ_code == user_organ_code).distinct().all()
        project_name = [name for name, in project_name]
        
        manager_id = db.query(project_manage_table.manager_id).filter(project_manage_table.organ_code == user_organ_code).distinct().all()
        manager_id = [name for name, in manager_id]
        
        request_id = db.query(project_manage_table.request_id).filter(project_manage_table.organ_code == user_organ_code).distinct().all()
        request_id = [name for name, in request_id]

             
        return manager_id
         
    except:
        raise HTTPException(status_code=500, detail='DBError')        
    
def get_project_list(db, offset, limit, user_id, *status_filter):
    
    project_manage_table = projectManageModel.ProjectManageTable
    project_table = projectManageModel.ProjectTable
    member_table = memberManageModel.MemberTable
    
    try:    
        user_organ_code = db.query(member_table.department_code).filter(member_table.user_id==user_id) # 기업코드 확인
        # query = db.query(project_manage_table).filter(project_manage_table.organ_code == user_organ_code).order_by(desc(project_manage_table.id))
        
        query = db.query(project_manage_table.id,
                        project_manage_table.title,
                        project_table.project_name,
                        project_manage_table.request_id,
                        project_manage_table.manager_id,
                        project_manage_table.work_status,
                        project_manage_table.created_at,
                        project_manage_table.work_end_date
                        ).filter(project_table.organ_code==user_organ_code
                        ).join(project_table, project_manage_table.project_code == project_table.project_code).order_by(desc(project_manage_table.id))

        # 필터 O
        if status_filter:    
            if status_filter == 'MyProject':
                query = query.filter(project_manage_table.manager_id == user_id)
            elif status_filter == 'MyRequest':
                query = query.filter(project_manage_table.request_id == user_id)
        # 필터 X
        project_count = query.count() # 캐시처리       
        project_list = query.offset(offset).limit(limit).all()
        
        return project_count, project_list
    except:
        raise HTTPException(status_code=500, detail='DBError')        

def insert_project(db,inbound_data,user_id):
    
    project_manage_table = projectManageModel.ProjectManageTable
    project_table = projectManageModel.ProjectTable
    member_table = memberManageModel.MemberTable

    try:
        organ_code = db.query(member_table.department_code).filter(member_table.user_id == user_id).first()
        project_code = db.query(project_table.project_code).filter(project_table.project_name == inbound_data.project_name).first()

        
        db_query = project_manage_table(
            organ_code=organ_code[0],
            project_code=project_code[0],
            title=inbound_data.title,
            request_id=inbound_data.request_id,
            manager_id=inbound_data.manager_id,
            content=inbound_data.content,
            work_status=inbound_data.work_status,
            created_id=user_id)
        
        db.add(db_query)

    except:
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
        HTTPException(status_code=500, detail='dbDeleteError')