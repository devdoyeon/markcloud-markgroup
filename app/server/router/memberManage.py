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

# 부서리스트
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

# 직원리스트
@router_member.get('/member/list', response_model= Response[List[MemberOut]])
def read_member_list(
    page:int = 1,
    limit:int = 10,
    db: Session = Depends(get_db)
):
    offset = (page -1) * limit
    
    total_count,member_list = get_member_list(db,offset,limit)
    total_page = total_count // limit
    
    if total_count % limit != 0:
        total_page += 1    

    return Response().metadata(
        page=page,
        totalPage=total_page,
        offset=offset,
        limit=limit
    ).success_response(member_list)
