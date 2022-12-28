from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from enum import Enum
from starlette import status
from datetime import date

from database import get_db
from schema.base_schema import Response, projectStatusType
from schema.project_schema import *
from crud import project_crud
from router import author_chk


router = APIRouter(prefix="/project")


@router.get("/list", response_model=Response[List[ProjectListOut]]) 
@author_chk.varify_access_token
def project_list(project_name: Optional[str] = None, 
                 project_status: Optional[projectStatusType] = None,
                 start_date: Optional[date] = None,
                 end_date: Optional[date] = None,
                 page: int = 1,
                 limit: int = 10,
                 access_token: str = Header(None),
                 user_pk:int = None,
                 db: Session = Depends(get_db)):
    offset = (page - 1) * limit
        
    total, _project_list = project_crud.get_project_list(db, project_name, project_status, start_date, end_date, offset, limit, user_pk)

    totalPage = total // limit
    if total % limit != 0:
        totalPage += 1
    
    return Response().metadata(
            page=page,
            totalPage=totalPage,
            offset=offset,
            limit=limit
        ).success_response(_project_list)


@router.get("/detail", response_model=ProjectOut)
def project_detail(project_id: int, db: Session = Depends(get_db)):
    db_project = project_crud.get_project(db, project_id)
    return db_project
    

@router.get("/project_members") #, response_model=List[ProjectMemberListOut])
def project_member_list(project_id: int, db: Session = Depends(get_db)):
    db_project = project_crud.get_project(db, project_id)
    project_code = db_project.project_code
    members = project_crud.get_project_members(db, project_code)
    members = [member.user_id for member in members]
    return members


@router.post("/create")
@author_chk.varify_access_token
def project_create(project_create: ProjectCreate, 
                   access_token:str = Header(None),
                   user_pk:int = None,
                   db: Session = Depends(get_db)):
    project_crud.create_project(db, user_pk, project_create)
    

@router.post("/update")
@author_chk.varify_access_token
def project_update(project_id: int, 
                   project_update: ProjectUpdate, 
                   access_token:str = Header(None),
                   user_pk:int = None,
                   db: Session = Depends(get_db)):
    try:
        project_crud.update_project(db, project_update, project_id, user_pk)
    except:
        raise HTTPException(status_code=500, detail='UpdateNtError')
    

@router.get("/member")
@author_chk.varify_access_token
def organ_member_list(access_token:str = Header(None),
                      user_pk:int = None,
                      db: Session = Depends(get_db)):
    member_list = project_crud.get_organ_member(db, user_pk)
    return member_list


@router.post("/member_add")
@author_chk.varify_access_token
def project_member_add(project_id: int, 
                       project_member_add: ProjectMemberAdd, 
                       access_token:str = Header(None),
                       user_pk:int = None,
                       db: Session = Depends(get_db)):
    new_member_id = project_member_add.new_member_id
    db_project = project_crud.get_project(db, project_id)
    project_code = db_project.project_code
    
    # 이미 참여중인 멤버를 또 추가하면 에러 반환.
    if project_crud.get_project_member(db, project_code, new_member_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="이미 참여중인 인원입니다.")
        
    # groupware_project_members 테이블에 insert.
    db_project = project_crud.get_project(db, project_id)
    project_code = db_project.project_code
    project_crud.add_project_member(db, project_code, new_member_id, user_pk)


@router.post("/member_delete")
@author_chk.varify_access_token
def project_member_delete(project_id:int, 
                          project_member_delete: ProjectMemberDelete, 
                          access_token:str = Header(None),
                          user_pk:int = None,
                          db: Session = Depends(get_db)):
    delete_member_id = project_member_delete.delete_member_id
    # 현재 프로젝트 코드
    db_project = project_crud.get_project(db, project_id)
    project_code = db_project.project_code
    
    db_project_member = project_crud.get_project_member(db, project_code, delete_member_id)
    project_crud.delete_project_member(db, db_project_member)
    
    
# 프로젝트 삭제
@router.post("/delete")
@author_chk.varify_access_token
def project_delete(
    project_id: int,
    user_pk:int = None,
    access_token:str = Header(None),
    db: Session = Depends(get_db)):
    
    project_crud.delete_project(db, project_id, user_pk)