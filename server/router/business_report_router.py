from fastapi import APIRouter, Depends, HTTPException, Header, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional, Union

from database import get_db
from schema.base_schema import Response, filterType
from schema.report_schema import ReportListOut, ReportOut, ReportCreate, ReportUpdate
from crud import report_crud
from router import security

from crud import customError


router = APIRouter(prefix="/report")


@router.get("/list", response_model=Response[List[ReportListOut]])
@security.varify_access_token
def report_list(
    access_token: str = Header(None),
    user_pk:int = None,
    filter_type: Optional[filterType] = None,
    filter_val: Optional[str] = None,
    page: int = 1,
    limit: int = 5,
    db: Session = Depends(get_db)
):
    try:
        offset = (page - 1) * limit
        total, _report_list = report_crud.get_report_list(db, filter_type, filter_val, offset, limit, user_pk)
        totalPage = total // limit
        if total % limit != 0:
            totalPage += 1
        
        return Response().metadata(
            page=page,
            totalPage=totalPage,
            offset=offset,
            limit=limit
        ).success_response(_report_list)
    except:
        raise HTTPException(status_code=500, detail='ReportListError')
    
    
@router.get("/detail", response_model=ReportOut)
@security.varify_access_token
@security.user_chk
def report_detail(report_id: int, 
                  access_token: str = Header(None),
                  user_pk: int = None,
                  user_info: str = None,
                  db: Session = Depends(get_db)):
    try:
        report = report_crud.get_report(db, report_id, user_info)
        
        if report.img_url:
            new_img_url = report.img_url
            img_url = new_img_url.split(',')
        else:
            img_url = None
            
        outbound = ReportOut(
            title = report.title,
            created_id = report.created_id,
            created_at = report.created_at,
            updated_at = report.updated_at,
            content = report.content,
            img_url = img_url
        )
        return outbound
        # return report
    except:
        raise HTTPException(status_code=500, detail='ReportDetailError')


@router.post("/create")
@security.varify_access_token
@security.user_chk
def report_create(
    file: Union[List[UploadFile], None] = None,
    _report_create: ReportCreate = Depends(),
    access_token:str = Header(None),
    user_info: str = None,
    user_pk:int = None, 
    db: Session = Depends(get_db)
):
    try:
        # report_crud.create_report(db, user_pk, _report_create)
        data = report_crud.create_report(db, _report_create, file, user_info)
        return Response().success_response(data)
    except customError.S3ConnError:
        raise HTTPException(status_code=505, detail='S3ConnError')
    except:
        raise HTTPException(status_code=500, detail='ReportCreateError')


@router.post("/update")
@security.varify_access_token
@security.user_chk
def report_update(
    report_id: int, 
    file: Union[List[UploadFile], None] = None,
    _report_update: ReportUpdate = Depends(), 
    access_token:str = Header(None),
    user_info: str = None,
    user_pk:int = None,
    db: Session = Depends(get_db)
):
    try:
        # report_crud.update_report(db, _report_update, report_id, user_pk)
        data = report_crud.update_report(db, report_id, _report_update, file, user_info)
        print(data)
        return Response().success_response(data)
    except:
        raise HTTPException(status_code=500, detail='ReportUpdateError')
    
    
@router.post("/delete")
@security.varify_access_token
def report_delete(report_id: int,
                  access_token:str = Header(None),
                  user_pk:int = None,
                  db: Session = Depends(get_db)):
    
    try:
        report_crud.delete_report(db, report_id, user_pk)
    except:
        raise HTTPException(status_code=500, detail='ReportDeleteError')
    
   