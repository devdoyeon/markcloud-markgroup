# 업무 관리
from model import projectManageModel, memberManageModel
from sqlalchemy import desc
from datetime import datetime
from crud import customError, utils

def get_project_member(db, user_info, inbound_filter): # 프로젝트 멤버
    
    member_table = memberManageModel.MemberTable

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
    
    project_member = {i[0]:i[1]+'('+str(i[2])+')' for i in project_member}
    return project_member


def get_project_name(db, user_info): # 처음 렌더링할때 뿌려줘야하는 프로젝트명 데이터
    
    project_table = projectManageModel.ProjectTable

    # admin 계정일 경우 전체 프로젝트명 가져오기
    if user_info.groupware_only_yn == 'N': 
        all_pjt_name = db.query(project_table.project_name).filter(project_table.organ_code == user_info.department_code).order_by(desc(project_table.id)).all()
    
    else: 
        # 자신이 속한 프로젝트명 가져오기
        p_name_query = f'''
        SELECT project_name FROM groupware_project 
        WHERE project_code = ANY(SELECT project_code 
        FROM groupware_project_members WHERE user_id = "{user_info.user_id}")
        ORDER BY id DESC
        '''
        all_pjt_name = db.execute(p_name_query).fetchall()
    all_pjt_name = [name for name, in all_pjt_name] 
    return all_pjt_name
    
    
def get_project_list(db, offset, limit, user_info, *filter):

    query = f'''SELECT a.id,
                a.title,
                b.project_name,
                a.content, 
                (SELECT concat(name,'(',section,')') from members where a.request_id = members.id) as request_id,
                (SELECT concat(name,'(',section,')') from members where a.manager_id = members.id) as manager_id,
                a.work_status,
                a.created_at,
                a.created_id,
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

def get_project_info(db, project_id,user_info):

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
                c.user_id as created_id,
                a.work_end_date,
                a.img_url
                FROM groupware_work_management as a
                INNER JOIN groupware_project as b
                ON a.project_code = b.project_code
                INNER JOIN members as c
                ON a.created_id = c.id
                WHERE b.organ_code = "{user_info.department_code}"
                AND a.id = {project_id}
                '''
    project_info = db.execute(query).fetchone()
    return project_info


def insert_project(db,inbound_data,file, user_info):
    
    project_manage_table = projectManageModel.ProjectManageTable
    project_table = projectManageModel.ProjectTable

    project_code = db.query(project_table.project_code).filter(project_table.project_name == inbound_data.project_name).first()
    
    if file:
        img_url = utils.get_s3_url(file, 'work')
    else:
        img_url = None
    
    db_query = project_manage_table(
        organ_code=user_info.department_code,
        project_code=project_code[0],
        title=inbound_data.title,
        request_id=inbound_data.request_id,
        manager_id=inbound_data.manager_id,
        content=inbound_data.content,
        work_status=inbound_data.work_status,
        created_at = datetime.today(),
        updated_at =datetime.today(),
        created_id=user_info.id,
        img_url = img_url )
    
    result = db.add(db_query)
    return result

def change_project(db,inbound_data, project_id):
    
    project_manage_table = projectManageModel.ProjectManageTable
    
    values = {
            # 'request_id':inbound_data.request_id,
            'manager_id':inbound_data.manager_id,
            'work_status':inbound_data.work_status,
            'title':inbound_data.title,
            'content':inbound_data.content,
            'updated_at':datetime.today()}
    
    if inbound_data.work_status == '완료':
        values['work_end_date'] = datetime.today()
    
    result = db.query(project_manage_table).filter_by(id = project_id).update(values)
    return result
        

def remove_project(db, notice_id, user_info):

    project_manage_table = projectManageModel.ProjectManageTable
    
    base_q = db.query(project_manage_table).filter(project_manage_table.id == notice_id)
    if user_info.id == int(base_q.first().created_id) or user_info.groupware_only_yn == 'N':
        result = base_q.delete()
        return result
    else:
        raise customError.InvalidError
