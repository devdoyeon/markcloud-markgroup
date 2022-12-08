# 인사 관리
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import *
from crud.memberManageCrud import *

router_member = APIRouter(
    prefix="/member",
    tags=['Personnel Manage API']
)

# 전체 직원 불러오기
@router_member.get('/read')
def read_member( 
    db: Session = Depends(get_db),
):
    return get_members(db)

# 전체 직원 수 
@router_member.get('/count')
def count_member(
    db: Session = Depends(get_db),
):
    return get_members_count(db)


@router_member.post('/create/department') # 소속 추가, 직원 추가 
def create_member(
    db: Session =Depends(get_db)
):
    return insert_member(db)

@ router_member.post('/create/member')
def create_department(
    db: Session = Depends(get_db)
):
    return insert_department(db)

@router_member.post('/update')
def update_member(
    db: Session =Depends(get_db)
):
    return update_member(db)
    
@router_member.post('/delete')
def delete_employee(
):
    return remove_member(db)