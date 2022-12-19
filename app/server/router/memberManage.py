# 인사관리
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from fastapi.security import OAuth2PasswordBearer


from database import *
from crud.memberManageCrud import *
from schema.memberManageSchema import *
from schema.responseSchema import *
from router.author_chk import *


router_member = APIRouter(
    prefix = '/personnel',
    tags=['Personnel Manage API']
)
# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

##################################부서 관리##################################
# 부서 리스트

@router_member.get('/department/list', response_model= Response[List[DepartmentOut]])
def read_department_list(
    user_pk:int = 100,
    page:int = 1,
    limit:int = 5,
    db: Session = Depends(get_db)
):

    offset = (page - 1) * limit
    
    total_count, department_list = get_department_list(db, offset, limit, user_pk)
    total_page = total_count // limit
    
    if total_count % limit != 0:
        total_page += 1
    
    return Response().metadata(
    page=page,
    totalPage=total_page,
    offset=offset,
    limit=limit).success_response(department_list)

# 부서 상세페이지
@router_member.get('/department/info', response_model = DepartmentOut)    
def read_department_info(
    department_id:int,
    db: Session = Depends(get_db)
):
    return get_department_info(db, department_id)

# 부서 등록
@router_member.post('/department/create')
def create_department(
    inbound_data:DepartmentIn,
    user_pk:int = 100,
    db :Session = Depends(get_db)
):
    insert_department(db, inbound_data, user_pk)

# 부서 수정
@router_member.post('/department/update')
def update_department(
    inbound_data:DepartmentIn,
    department_id:int,
    db: Session = Depends(get_db)
):
    change_department(db, inbound_data, department_id)


# 부서 삭제
@router_member.post('/department/delete')
def delete_department(
    department_id:int,
    db: Session = Depends(get_db)
):
    remove_department(db, department_id)

##################################직원 관리##################################

# 직원 리스트
@router_member.get('/member/list', response_model= Response[List[MemberOut]])
def read_member_list(
    page:int = 1,
    limit:int = 10,
    user_pk:int = 100,
    db: Session = Depends(get_db)
):
    offset = (page -1) * limit
    
    total_count, member_list = get_member_list(db,offset,limit,user_pk)
    total_page = total_count // limit
    
    if total_count % limit != 0:
        total_page += 1    

    return Response().metadata(
        page=page,
        totalPage=total_page,
        offset=offset,
        limit=limit
    ).success_response(member_list)

# 직원 상세페이지
@router_member.get('/member/info',response_model= MemberOut)
def read_member_info(
    member_id:int,
    db: Session = Depends(get_db)
):
    return get_member_info(db, member_id)


# 직원 등록
@router_member.post('/member/create')
def create_member(
    inbound_data: MemberIn,
    user_pk:int = 100,
    db: Session = Depends(get_db)
):
    insert_member(db,inbound_data,user_pk)

# 직원 수정
@router_member.post('/member/update')
def update_member(
    inboud_data: MemberIn,
    member_id:int,
    db: Session = Depends(get_db)
):
    change_member(db, inboud_data ,member_id)
    

# 직원 삭제
@router_member.post('/member/delete')
def delete_member(
    member_id:str,
    db: Session = Depends(get_db)
):
    remove_member(db,member_id)
