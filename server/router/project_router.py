from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from enum import Enum
from starlette import status
from datetime import date

from database import get_db
from schema.base_schema import Response
from schema.project_schema import *
from crud import project_crud
import utils
# from server.schema.project_schema import Project, ProjectListOut, ProjectOut, ProjectCreate, ProjectUpdate, ProjectMemberAdd, ProjectMemberDelete

router = APIRouter(prefix="/project")


class projectStatusType(str, Enum):
    before = "before"     # 시작전
    ongoing = "ongoing"   # 진행중
    complete = "complete" # 종료


@router.get("/list", response_model=Response[List[ProjectListOut]]) 
def project_list(project_name: Optional[str] = None, 
                 project_status: Optional[projectStatusType] = None,
                 start_date: Optional[date] = None,
                 end_date: Optional[date] = None,
                 user_id: str = "mxxvii", # 로그인한 사용자의 아이디. # user_id -> current_user로 변경예정
                 page: int = 1,
                 limit: int = 10,
                 admin: bool = False,   # 대표계정인지 여부
                 db: Session = Depends(get_db)):
    offset = (page - 1) * limit
    total, _project_list = project_crud.get_project_list(db, project_name, project_status, start_date, end_date, offset, limit, user_id, admin)
    print(_project_list)

    totalPage = total // limit
    if total % limit != 0:
        totalPage += 1
    
    # return _project_list
    return Response().metadata(
            page=page,
            totalPage=totalPage,
            offset=offset,
            limit=limit
        ).success_response(_project_list)


@router.get("/detail", response_model=Project)
def project_detail(project_id: int, db: Session = Depends(get_db)):
    project = project_crud.get_project(db, project_id)
    return project


@router.get("/project_members", response_model=List[ProjectMemberListOut])
def project_member_list(project_id: int, db: Session = Depends(get_db)):
    db_project = project_crud.get_project(db, project_id)
    project_code = db_project.project_code
    members = project_crud.get_project_members(db, project_code)
    return members


@router.post("/create")
def project_create(project_create: ProjectCreate, user_id: str = "mxxvii", db: Session = Depends(get_db)):
    project_crud.create_project(db, user_id, project_create)
    # 처음 생성할 때는 해당 유저를 groupware_project_members에 넣어야 함.
    

@router.post("/update")
def project_update(project_id: int, project_update: ProjectUpdate, user_id: str ="mxxvii", db: Session = Depends(get_db)):
    db_project = project_crud.get_project(db, project_id)
    if not db_project:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="데이터를 찾을 수 없습니다.")
        
    project_crud.update_project(db, db_project, project_update, user_id)
    

# 드롭다운 장지원(SI) 이런 식으로 나와야 함..! 동명이인이 있을 수 있기 ㄸ ㅐ문ㅇ ㅔ . . .
@router.get("/member")
def organ_member_list(user_id: str = "mxxvii", db: Session = Depends(get_db)):
    member_list = project_crud.get_organ_member(db, user_id)
    return member_list


@router.post("/member_add")
def project_member_add(project_id: int, project_member_add: ProjectMemberAdd, user_id: str = "mxxvii", db: Session = Depends(get_db)):
    new_member_id = project_member_add.new_member_id
    # 현재 프로젝트 코드
    db_project = project_crud.get_project(db, project_id)
    project_code = db_project.project_code
    
    # 이미 참여중인 멤버를 또 추가하면 에러 반환.
    if project_crud.get_project_member(db, project_code, new_member_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="이미 참여중인 인원입니다.")
        
    # groupware_project_members 테이블에 insert.
    db_project = project_crud.get_project(db, project_id)
    project_code = db_project.project_code
    project_crud.add_project_member(db, project_code, new_member_id, user_id)


@router.post("/member_delete")
def project_member_delete(project_id:int, project_member_delete: ProjectMemberDelete, user_id: str = "mxxvii", db: Session = Depends(get_db)):
    delete_member_id = project_member_delete.delete_member_id
    # 현재 프로젝트 코드
    db_project = project_crud.get_project(db, project_id)
    project_code = db_project.project_code
    
    db_project_member = project_crud.get_project_member(db, project_code, delete_member_id)
    project_crud.delete_project_member(db, db_project_member)
    
    
# 프로젝트 삭제
@router.post("/delete")
def project_delete(project_id: int, db: Session = Depends(get_db)):
    # 삭제할 프로젝트
    db_project = project_crud.get_project(db, project_id)
    project_code = db_project.project_code
    # 해당 프로젝트 참여하는 모든 멤버 삭제     
    project_crud.delete_project_members_all(db, project_code)
    
    # 해당 프로젝트 삭제
    project_crud.delete_project(db, db_project)
    