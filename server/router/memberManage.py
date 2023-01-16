# 인사관리
from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import *
from crud.memberManageCrud import *
from schema.memberManageSchema import *
from schema.responseSchema import *
from router import security
from crud import customError


router_member = APIRouter(
    prefix = '/personnel',
    tags=['Personnel Manage API']
)

##################################부서 관리##################################
# 부서 리스트
@router_member.get('/department/list', response_model= Response[List[DepartmentOut]])
@security.varify_access_token
@security.user_chk
def read_department_list(
    access_token: str = Header(None),
    user_pk:int = None,
    user_info:str = None,
    page:int = 1,
    limit:int = 5,
    db: Session = Depends(get_db)
):
    if user_info.groupware_only_yn == 'Y': # admin 이 아닌경우
        raise HTTPException(status_code=422, detail='NotAdmin')
    
    try:
        offset = (page - 1) * limit
        
        total_count, department_list = get_department_list(db, offset, limit, user_info)
        total_page = total_count // limit
        
        if total_count % limit != 0:
            total_page += 1
        
        return Response().metadata(
        page=page,
        totalPage=total_page,
        offset=offset,
        limit=limit).success_response(department_list)
        
    except:
        raise HTTPException(status_code=500, detail='ReadDpError')

# 부서 상세페이지
@router_member.get('/department/info', response_model = DepartmentOut)    
@security.varify_access_token
@security.user_chk
def read_department_info(
    department_id:int,
    access_token:str = Header(None),
    user_pk:int = None,
    user_info:str = None,
    db: Session = Depends(get_db)
):
    if user_info.groupware_only_yn == 'Y': # admin 이 아닌경우
        raise HTTPException(status_code=422, detail='NotAdmin')
    
    try:
        return get_department_info(db, department_id,user_info)
    except:
        raise HTTPException(status_code=500, detail='ReadDpInfoError')

# 부서 등록
@router_member.post('/department/create')
@security.varify_access_token
@security.user_chk
def create_department(
    inbound_data:DepartmentIn,
    access_token: str = Header(None),
    user_pk:int = None,
    user_info :str = None,
    db :Session = Depends(get_db)
):
    if user_info.groupware_only_yn == 'Y': # admin 이 아닌경우
        raise HTTPException(status_code=422, detail='NotAdmin')
    
    try:
        data = insert_department(db, inbound_data, user_info)
        return Response().success_response(data)
    
    except customError.DuplicatedError: 
        raise HTTPException(status_code=503, detail='DuplicatedDpError')
    except:
        raise HTTPException(status_code=500, detail='CreateDpError')

# 부서 수정
@router_member.post('/department/update')
@security.varify_access_token
@security.user_chk
def update_department(
    inbound_data:DepartmentIn,
    department_id:int,
    access_token:str = Header(None),
    user_pk:int = None,
    user_info:str = None,
    db: Session = Depends(get_db)
):
    if user_info.groupware_only_yn == 'Y': # admin 이 아닌경우
        raise HTTPException(status_code=422, detail='NotAdmin')
    
    try:
        data = change_department(db, inbound_data, department_id, user_info)
        return Response().success_response(data)
    
    except:
        raise HTTPException(status_code=500, detail='UpdateDpError')

    
# 부서 삭제
@router_member.post('/department/delete')
@security.varify_access_token
@security.user_chk
def delete_department(
    department_id:int,
    access_token:str = Header(None),
    user_pk:int = None,
    user_info:str =None,
    db: Session = Depends(get_db)

):
    if user_info.groupware_only_yn == 'Y': # admin 이 아닌경우
        raise HTTPException(status_code=422, detail='NotAdmin')
    
    try:
        data = remove_department(db, department_id, user_info)
        return Response().success_response(data)
    
    except:
        raise HTTPException(status_code=500, detail='DeleteDpError')

##################################직원 관리##################################

# 직원 리스트
@router_member.get('/member/list', response_model= Response[List[MemberOut]])
@security.varify_access_token
@security.user_chk
def read_member_list(
    access_token: str = Header(None),
    page:int = 1,
    limit:int = 10,
    user_pk:int = None,
    user_info:str = None,
    db: Session = Depends(get_db)
):
    if user_info.groupware_only_yn == 'Y': # admin 이 아닌경우
        raise HTTPException(status_code=422, detail='NotAdmin')
    try:
        offset = (page -1) * limit
        
        total_count, member_list = get_member_list(db,offset,limit,user_info)

        total_page = total_count // limit
        if total_count % limit != 0:
            total_page += 1    

        return Response().metadata(
            page=page,
            totalPage=total_page,
            offset=offset,
            limit=limit
        ).success_response(member_list)
    except:
        raise HTTPException(status_code=500, detail='ReadMbError')


# 직원 상세페이지
@router_member.get('/member/info',response_model= Memberinfo)
@security.varify_access_token
@security.user_chk
def read_member_info(
    member_id:int,
    access_token:str = Header(None),
    user_pk:int = None,
    user_info:str = None,
    db: Session = Depends(get_db)
):
    if user_info.groupware_only_yn == 'Y': # admin 이 아닌경우
        raise HTTPException(status_code=422, detail='NotAdmin')
    
    try:
        return get_member_info(db, member_id)
    except:
        raise HTTPException(status_code=500, detail='ReadMbInfoError')


# 직원 등록
@router_member.post('/member/create')
@security.varify_access_token
@security.user_chk
def create_member(
    inbound_data: MemberIn,
    access_token: str = Header(None),
    user_pk:int = None,
    user_info:str = None,
    db: Session = Depends(get_db)
):
    if user_info.groupware_only_yn == 'Y': # admin 이 아닌경우
        raise HTTPException(status_code=422, detail='NotAdmin')
    
    try:
        data = insert_member(db,inbound_data,user_info)
        return Response().success_response(data)
    except:
        raise HTTPException(status_code=500, detail='CreateMbError')


# 직원 수정
@router_member.post('/member/update')
@security.varify_access_token
@security.user_chk
def update_member(
    member_id:int,    
    inboud_data: MemberModDTO,
    access_token:str = Header(None),
    user_pk:int = None,
    user_info:str = None,
    db: Session = Depends(get_db)
):
    if user_info.groupware_only_yn == 'Y': # admin 이 아닌경우
        raise HTTPException(status_code=422, detail='NotAdmin')
    
    try:
        data = change_member(db, inboud_data ,member_id)
        return Response().success_response(data)
    
    except:
        raise HTTPException(status_code=500, detail='UpdateMbError')


# 직원 삭제
@router_member.post('/member/delete')
@security.varify_access_token
@security.user_chk
def delete_member(
    member_id:str,
    access_token:str = Header(None),
    user_pk:int = None,
    user_info:str = None,
    db: Session = Depends(get_db)
):
    if user_info.groupware_only_yn == 'Y': # admin 이 아닌경우
        raise HTTPException(status_code=422, detail='NotAdmin')

    try:
        data = remove_member(db,member_id) 
        return Response().success_response(data)
    
    except:
        raise HTTPException(status_code=500, detail='DeleteMbError')

