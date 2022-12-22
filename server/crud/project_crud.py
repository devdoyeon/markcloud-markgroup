from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException
from starlette import status

from datetime import datetime, date
import random


from models import OrganizationTable
from model import projectManageModel,memberManageModel
from schema.project_schema import ProjectCreate, ProjectUpdate, ProjectMemberAdd
import utils


def get_project_list(db: Session, 
                     project_name: str, 
                     project_status: str, 
                     start_date: date, 
                     end_date: date, 
                     offset: int,
                     limit: int, 
                     user_id: str, 
                     admin: bool):
    
    # # 본인 회사의 프로젝트 리스트만 나오게.
    # project_list = db.query(ProjectTable).join(MemberTable, ProjectTable.organ_code == MemberTable.department_code).filter(MemberTable.user_id == user_id)
    # print(project_list)
    
    
    # # 서 브 쿼 리 로 ! ! ! cnt를 서브쿼리로.
    # sub_query = db.query(ProjectTable.project_code,
    #                      func.count(ProjectMembersTable.project_code).label('cnt')
    #                      ).join(ProjectTable, ProjectTable.project_code == ProjectMembersTable.project_code).group_by(ProjectTable.project_code)
    # print(sub_query)
    # print(" s u b q u e r y ")
    
    
        
    # 대표 계정은 프로젝트 리스트 전체, 사용자 계정은 본인이 참여한 프로젝트 리스트만

    if admin:
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
        limit {limit}
        offset {offset}
        ;
            '''

    
    else:
        sql = f'''
        select
        *
        from (
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
            on p.project_code = pm.project_code) wholeList
            right join (
                select
                    project_code
                from
                    groupware_project_members
                where
                    user_id = "{user_id}") myProject
            on wholeList.project_code = myProject.project_code
            limit {limit}
            offset {offset};
        '''
    
    project_list = db.execute(sql).all()
    print(project_list)
    
    total = len(project_list)
    print(f"t o t a l :: {total}")
    return total, project_list
    
    
    # 검색은 나중에 구현
    # search = f'%%{project_name}%%'
    # project_list = project_list.filter(ProjectTable.project_name.ilike(search))
    # if project_status:
    #     project_list = project_list.filter(ProjectTable.project_status=="before")
    # if start_date:
    #     project_list = project_list.filter(ProjectTable.project_start_date >= start_date, ProjectTable.project_end_date <= end_date)
    
    print(project_status)
    print("= = = 상 태 = = = ")
    
    
    
    # total = project_list.distinct().count()
    print(f"t o t a l :: {total}")
    project_list = project_list.order_by(ProjectTable.created_at.desc()).all()
    return total, project_list


def get_project(db: Session, project_id: int):
    try:
        project = db.query(projectManageModel.ProjectTable).get(project_id)
        return project
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")
    
    
def get_project_members(db: Session, project_code: str):
    try:
        project_members = db.query(projectManageModel.ProjectMemberTable).filter(projectManageModel.ProjectMemberTable.project_code == project_code).all()
        return project_members
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")


def create_project(db: Session, user_id: str, project_create: ProjectCreate):
    try:
        organ_code = utils.get_organ_code(db, user_id)
        # 등록 버튼 클릭 시, 프로젝트 등록(groupware_project 테이블)
        #     프로젝트코드 생성규칙
        #     PRJ + 년월일 + Random 난수번호(5자리)
        #     ex) PRJ22121618923
        yymmdd = datetime.today().strftime("%y%m%d")
        random_int = random.randint(10000,99999)
        random_number = str(random_int)
        project_code = "PRJ" + yymmdd + random_number
        print(project_code)

        db_project = projectManageModel.ProjectTable(organ_code=organ_code,
                                project_code=project_code,
                                project_name=project_create.project_name,
                                project_description=project_create.project_description,
                                project_start_date=project_create.project_start_date,
                                project_end_date=project_create.project_end_date,
                                project_status=project_create.project_status,
                                created_at=datetime.now(),
                                created_id=user_id,
                                updated_at=datetime.now(),
                                updated_id=user_id
                                )
        db.add(db_project)
        db.commit() # 이 커밋 지우니까 안되는데.?
        # 처음 생성할 때는 해당 유저를 groupware_project_members에 넣어야 함.
        # 이렇게 해도 되는 ㅈㅣ .. . ?
        db_project_member = projectManageModel.ProjectMemberTable(
                    project_code=project_code,
                    user_id=user_id,
                    created_at=datetime.now(),
                    created_id=user_id,
                    updated_at=datetime.now(),
                    updated_id=user_id
                )
        db.add(db_project_member)
        db.commit()
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")


def update_project(db: Session, db_project: projectManageModel.ProjectTable, project_update: ProjectUpdate, user_id: str):     # current_user로 고치기
    try:
        db_project.project_name = project_update.project_name
        db_project.project_description = project_update.project_description
        db_project.project_start_date = project_update.project_start_date
        db_project.project_end_date = project_update.project_end_date
        db_project.project_status = project_update.project_status
        db_project.updated_at = datetime.now()
        db_project.updated_id = user_id     # current_user로 고치기
        
        db.add(db_project)
        db.commit()
        
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")
    

def get_organ_member(db: Session, user_id: str):
    organ_code = utils.get_organ_code(db, user_id)
    
    try:
        member_list = db.query(memberManageModel.MemberTable.user_id, memberManageModel.MemberTable.name, memberManageModel.MemberTable.section).filter(memberManageModel.MemberTable.department_code == organ_code).all()
        return member_list
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")


def add_project_member(db: Session,
                       project_code: str,
                       new_member_id: str, 
                       user_id: str):   # user_id: 로그인한 아이디, 프로젝트 참여 멤버들 추가하는 아이디.
    try:
        db_project_member = projectManageModel.ProjectMemberTable(
                    project_code=project_code,
                    user_id=new_member_id,
                    created_at=datetime.now(),
                    created_id=user_id,
                    updated_at=datetime.now(),
                    updated_id=user_id
                )
        
        db.add(db_project_member)
        db.commit()
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")


def get_project_member(db: Session, project_code: str, member_id: str):
    try:
        project_member = db.query(projectManageModel.ProjectMemberTable).filter(projectManageModel.ProjectMemberTable.user_id == member_id, 
                                                              projectManageModel.ProjectMemberTable.project_code == project_code).first()
        return project_member
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")


# 프로젝트 수정에서 인원 한 명씩 삭제
def delete_project_member(db: Session, db_project_member: projectManageModel.ProjectMemberTable):
    try:
        db.delete(db_project_member)
        db.commit()
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")
    
    

# 프로젝트 삭제에서 해당 프로젝트 참여 인원 전체 삭제
def delete_project_members_all(db: Session, project_code: str):
    try:
        db.query(projectManageModel.ProjectMemberTable).filter(projectManageModel.ProjectMemberTable.project_code == project_code).delete()
        db.commit()
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")


# 프로젝트 삭제
def delete_project(db: Session, db_project: projectManageModel.ProjectTable):
    try:
        db.delete(db_project)
        db.commit()
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")
    
