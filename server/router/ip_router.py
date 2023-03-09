from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List

from database import *
from crud import ip_crud
from router import security

from schema.base_schema import Response
from schema.ip_schema import *


router = APIRouter(prefix="/ip")

@router.get("/list", response_model=Response[List[IPListOut]])
@security.varify_access_token
@security.user_chk
def ip_list(
    page: int = 1,
    limit: int = 10,
    access_token: str = Header(None),
    user_pk: int = None,
    user_info: str = None,
    db: Session = Depends(get_db)
):
    try:
        offset = (page-1)*limit
        total, _ip_list = ip_crud.get_ip_list(db, offset, limit, user_info)
        
        totalPage = total // limit
        if total % limit != 0:
            totalPage +=1
        print(total)
        
        return Response().metadata(
            page=page,
            totalPage=totalPage,
            offset=offset,
            limit=limit            
        ).success_response(_ip_list)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)


@router.get("/detail")
@security.varify_access_token
@security.user_chk
def ip_detail(
    ip_id: int,
    access_token: str = Header(None),
    user_pk: int = None,
    user_info: str = None,
    db: Session = Depends(get_db)
):
    try:
        db_ip = ip_crud.get_ip(db, ip_id)        
        outbound = IPOut(
            rights = db_ip.rights,
            application_date = db_ip.application_date,
            application_number = db_ip.application_number,
            applicant = db_ip.applicant,
            status = db_ip.status,
            name_kor = db_ip.name_kor,
            name_eng = db_ip.name_eng,
            product_code = db_ip.product_code,
            registration_date = db_ip.registration_date,
            registration_number = db_ip.registration_number,
            created_id = db_ip.created_id,
            created_at = db_ip.created_at,
            user_pk = user_pk
        )
        return outbound
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

    
@router.post("/create")
@security.varify_access_token
@security.user_chk
def ip_create(
    ip_create: IPCreate,
    access_token: str = Header(None),
    user_pk: int = None,
    user_info: str = None,
    db: Session = Depends(get_db)
):
    try:
        data = ip_crud.create_ip(db, user_info, ip_create)
        return Response().success_response(data)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    
    
@router.post("/update")
@security.varify_access_token
@security.user_chk
def ip_update(
    ip_id: int,
    ip_update: IPUpdate,
    user_pk: int = None,
    user_info: str = None,
    access_token: str = Header(None),
    db: Session = Depends(get_db)
):
    try:
        data = ip_crud.update_ip(db, ip_id, ip_update, user_info)
        return Response().success_response(data)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    except Exception as e:
        print(e)
    
    
@router.post("/delete")
@security.varify_access_token
@security.user_chk
def ip_delete(
    ip_id: int,
    user_pk: int = None,
    user_info: str = None,
    access_token: str = Header(None),
    db: Session = Depends(get_db)
):
    try:
        data = ip_crud.delete_ip(db, ip_id)
        return Response().success_response(data)
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)

    
    
