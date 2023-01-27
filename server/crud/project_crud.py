from sqlalchemy.orm import Session
from fastapi import HTTPException
from starlette import status

from datetime import datetime, date
import random

from model.projectManageModel import *
from model.memberManageModel import *
from router import security
from schema.project_schema import ProjectCreate, ProjectUpdate

from crud import utils
from crud import customError


def get_project_list(
    db: Session, 
    project_name: str, 
    project_status: str, 
    start_date: date, 
    end_date: date, 
    offset: int,
    limit: int,
    user_pk: int
):
    user_info = security.get_user_info(db, user_pk)
    
    sql = f'''
        select
            p.id,
            p.project_status,
            p.project_name,
            p.project_start_date,
            p.project_end_date,
            p.project_code,
            ifnull(pm.member_cnt, 0) as member_cnt
        from groupware_project p
        left join (
                select project_code, count(project_code) as member_cnt
                from groupware_project_members
                group by project_code) pm
        on p.project_code = pm.project_code
        where p.organ_code = "{user_info.department_code}"
    '''
    
    # 사용자 계정 : 본인이 참여한 프로젝트 리스트만
    if user_info.groupware_only_yn == 'Y':
        sql = sql + f'''
        and p.project_code in (
							select project_code
							from groupware_project_members 
							where user_id = "{user_info.user_id}"
                            union
                            select project_code
                            from groupware_project
                            where created_id = "{user_pk}"
       )
        '''
    
    # 검색
    if project_name:
        search = f'%%{project_name}%%'
        sql = sql + f''' and p.project_name like "{search}" '''    

    if project_status == "before":
        sql = sql + f''' and p.project_status = "before" '''
    elif project_status == "progress":
        sql = sql + f''' and p.project_status = "progress" '''
    elif project_status == "complete":
        sql = sql + f''' and p.project_status = "complete" '''
        
        
    if start_date:
        sql = sql + f'''
                    and p.project_start_date >= "{start_date}"
                    '''    
    if end_date:
        sql = sql + f'''
                    and p.project_end_date <= "{end_date}"
                    '''

    sql = sql + '''
                order by p.id desc
                '''
    
    project_list = db.execute(sql).all()
    total = len(project_list)
    
    sql = sql + f'''
                limit {limit}
                offset {offset}
                '''
    project_list = db.execute(sql).all()
    return total, project_list


def get_project(db: Session, project_id: int):
    project = db.query(ProjectTable.id, 
                        ProjectTable.project_code,
                        ProjectTable.project_name,
                        ProjectTable.project_description,
                        ProjectTable.project_start_date,
                        ProjectTable.project_end_date,
                        ProjectTable.project_status,
                        ProjectTable.created_at,
                        MemberTable.name.label('created_id'),
                        ProjectTable.img_url
                        ).join(MemberTable, MemberTable.id == ProjectTable.created_id) \
                            .filter(ProjectTable.id == project_id).first()
    return project
    
    
def get_project_members(db: Session, project_code: str):
    try:
        project_members = db.query(ProjectMemberTable.user_id, MemberTable.name, MemberTable.section) \
            .join(MemberTable, MemberTable.user_id == ProjectMemberTable.user_id) \
                .filter(ProjectMemberTable.project_code == project_code).all()
        return project_members
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")


def create_project(db: Session, user_pk: int, project_create: ProjectCreate, file):
    
    # 프로젝트 이름이 이미 있으면 생성하지 못하게 하기
    input_project_name = project_create.project_name
    try:
        project = db.query(ProjectTable).filter(ProjectTable.project_name == input_project_name).first()
    except:
        raise HTTPException(status_code=500, detail='GetProjectNameError')
    
    if project:
        raise HTTPException(status_code=403, detail='AlreadyProjectName')
    try:
        user_info = security.get_user_info(db, user_pk)
        # PRJ + 년월일 + Random 난수번호(5자리)
        yymmdd = datetime.today().strftime("%y%m%d")
        random_int = random.randint(10000,99999)
        random_number = str(random_int)
        project_code = "PRJ" + yymmdd + random_number
            
        if file:
            print(file)
            img_url = utils.get_s3_url(file, 'project')
        else:
            img_url = None

        db_project = ProjectTable(
            organ_code=user_info.department_code,
            project_code=project_code,
            project_name=project_create.project_name,
            project_description=project_create.project_description,
            project_start_date=project_create.project_start_date,
            project_end_date=project_create.project_end_date,
            project_status=project_create.project_status,
            created_at=datetime.now(),
            created_id=user_pk,
            img_url=img_url
        )
        db.add(db_project)
        db.flush()
        
    except:
        raise HTTPException(status_code=500, detail='InsertPjtError')

    
def update_project(
    db: Session, 
    project_id: int, 
    project_update: ProjectUpdate, 
    file,
    user_info
):    
    db_project = db.query(ProjectTable).filter(ProjectTable.id == project_id).first()
    
    if user_info.id == int(db_project.created_id) or user_info.groupware_only_yn == 'N':
        
        update_values = {
            "project_name": project_update.project_name,
            "project_description": project_update.project_description,
            "project_start_date": project_update.project_start_date,
            "project_end_date": project_update.project_end_date,
            "project_status": project_update.project_status,
            "updated_at": datetime.now(),
            "updated_id": user_info.id
        }
        
        print("웅?")
        print(project_update)
        print("project_update")
        
        if project_update.url and file:
            print("1+1")
            origin_url = ','.join(project_update.url)
            img_url = utils.get_s3_url(file, 'project')
            update_values['img_url'] = origin_url + ',' + img_url
            
        elif project_update.url:
            print("1+0")
            origin_url = ','.join(project_update.url)
            update_values['img_url'] = origin_url
            
        elif file:
            print("0+1")
            img_url = utils.get_s3_url(file, 'project')
            update_values['img_url'] = img_url
        
        result = db.query(ProjectTable).filter_by(id = project_id).update(update_values)
        return result
    else:
        raise HTTPException(status_code=422, detail='InvalidClient')
    

def get_organ_member(db: Session, user_pk: int):
    user_info = security.get_user_info(db, user_pk)
    organ_code = user_info.department_code
    member_list = db.query(MemberTable.user_id, MemberTable.name, MemberTable.section)\
                            .filter(MemberTable.department_code == organ_code)\
                            .filter(MemberTable.is_active == 1)\
                            .all()
    return member_list
    

def add_project_member(
    db: Session,
    project_code: str,
    new_member_id: str, 
    user_pk: int
):
    db_project_member = ProjectMemberTable(
                project_code=project_code,
                user_id=new_member_id,
                created_at=datetime.now(),
                created_id=user_pk,
                updated_at=datetime.now(),
                updated_id=user_pk
            )
    db.add(db_project_member)


def get_project_member(db: Session, project_code: str, member_id: str):
    project_member = db.query(ProjectMemberTable).filter(ProjectMemberTable.user_id == member_id, 
                                                            ProjectMemberTable.project_code == project_code).first()
    return project_member


# 프로젝트 수정에서 인원 한 명씩 삭제
def delete_project_member(db: Session, db_project_member: ProjectMemberTable):
    db.delete(db_project_member)
    

# 프로젝트 삭제에서 해당 프로젝트 참여 인원 전체 삭제
def delete_project_members_all(db: Session, project_code: str):
    db.query(ProjectMemberTable).filter(ProjectMemberTable.project_code == project_code).delete()


# def delete_project(db: Session, project_id: int, user_pk: int):
def delete_project(db: Session, project_id: int, user_info: str):
    # user_info = security.get_user_info(db, user_pk)
    
    db_project = db.query(ProjectTable).filter(ProjectTable.id == project_id).first()
    project_code = db_project.project_code
    
    if user_info.id == int(db_project.created_id) or user_info.groupware_only_yn == 'N':
        
        # groupware_work_management 테이블에 있는 프로젝트는 삭제하면 안됨.
        q = db.query(ProjectManageTable).filter(ProjectManageTable.project_code == project_code).first()
        if q:
            raise HTTPException(status_code=403, detail='AlreadyUsedProject')
        
        # 해당 프로젝트 참여 인원 모두 삭제
        delete_project_members_all(db, project_code)
        # 프로젝트 삭제
        db.delete(db_project)
    else:
        raise customError.InvalidError