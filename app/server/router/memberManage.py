# 인사관리
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import *
from crud.memberManageCrud import *
from schema.memberManageSchema import *
from schema.responseSchema import *
from typing import List

router_member = APIRouter(
    prefix = '/블랙맘바',
    tags=['Personnel Manage API']
)

# 부서리스트
@router_member.get('/department/list', response_model= Response[List[DepartmentOut]])
def read_department_list(
    page:int = 1,
    limit:int = 5,
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit
    
    department_list = get_department_list(db, offset, limit)
    total_count = len(department_list)
    total_page = total_count // limit
    
    return Response().metadata(
    page=page,
    totalPage=total_page,
    offset=offset,
    limit=limit).success_response(department_list)
    
    
@router_member.get('/member/list', response_model= Response[List[MemberOut]])
def read_member_list(
    page:int = 1,
    limit:int = 10,
    db: Session = Depends(get_db)
):
    offset = (page -1) * limit
    
    member_list = get_member_list(db,offset,limit)
    total_count = len(member_list)
    total_page = total_count // limit
    
    if total_count % limit != 0:
        total_page += 1    
    try:
        return Response().metadata(
        page=page,
        totalPage=total_page,
        offset=offset,
        limit=limit
        ).success_response(member_list)
    except Exception as e:
        print(e)
# 
# @router_member.post('/create/department') # 소속 추가, 직원 추가 
# def create_member(
#     db: Session =Depends(get_db)
# ):
#     return insert_member(db)

# @ router_member.post('/create/member')
# def create_department(
#     db: Session = Depends(get_db)
# ):
#     return insert_department(db)

# @router_member.post('/update')
# def update_member(
#     db: Session =Depends(get_db)
# ):
#     return update_member(db)
    
# @router_member.post('/delete')
# def delete_employee(
# ):
#     return remove_member(db)