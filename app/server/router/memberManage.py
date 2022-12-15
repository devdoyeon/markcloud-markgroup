# 인사관리
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import *
from crud.memberManageCrud import *
from schema.memberManageSchema import *
from schema.responseSchema import *
from typing import List

router_member = APIRouter(
    prefix = '/personnel',
    tags=['Personnel Manage API']
)

# 부서 리스트
@router_member.get('/department/list', response_model= Response[List[DepartmentOut]])
def read_department_list(
    page:int = 1,
    limit:int = 5,
    user_id:str = 'songmoana',
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit
    
    total_count, department_list = get_department_list(db, offset, limit, user_id)
    total_page = total_count // limit
    
    if total_count % limit != 0:
        total_page += 1
    
    return Response().metadata(
    page=page,
    totalPage=total_page,
    offset=offset,
    limit=limit).success_response(department_list)

# 직원 리스트
@router_member.get('/member/list', response_model= Response[List[MemberOut]])
def read_member_list(
    page:int = 1,
    limit:int = 10,
    user_id:str = 'songmoana',
    db: Session = Depends(get_db)
):
    offset = (page -1) * limit
    
    total_count, member_list = get_member_list(db,offset,limit,user_id)
    total_page = total_count // limit
    
    if total_count % limit != 0:
        total_page += 1    

    return Response().metadata(
        page=page,
        totalPage=total_page,
        offset=offset,
        limit=limit
    ).success_response(member_list)


# 직원 등록
@router_member.post('/member/create')
def create_member(
    inbound_data: MemberIn,
    user_id:str = 'songmoana',
    db: Session = Depends(get_db)
):
    insert_member(db,inbound_data,user_id)

@router_member.post('/member/update')
def update_member(
    db:Session = Depends(get_db)
):
    pass


@router_member.post('/member/delete')
def delete_member(
    member_id:str,
    user_id:str = 'songmoana',
    db: Session = Depends(get_db)
):
    remove_member(db,member_id,user_id)
