from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from schema.base_schema import Response, filterType
from schema.report_schema import ReportListOut, ReportOut, ReportCreate, ReportUpdate
from crud import report_crud
from router import author_chk


router = APIRouter(prefix="/report")


@router.get("/list", response_model=Response[List[ReportListOut]])
@author_chk.varify_access_token
def report_list(
    access_token: str = Header(None),
    user_pk:int = None,
    filter_type: Optional[filterType] = None,
    filter_val: Optional[str] = None,
    page: int = 1,
    limit: int = 5,
    db: Session = Depends(get_db)
):
    
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
    
    
@router.get("/detail", response_model=ReportOut)
def report_detail(report_id: int, db: Session = Depends(get_db)):
    report = report_crud.get_report(db, report_id)
    return report


@router.post("/create")
@author_chk.varify_access_token
def report_create(_report_create: ReportCreate,
                  access_token:str = Header(None),
                  user_pk:int = None, 
                  db: Session = Depends(get_db)):
    report_crud.create_report(db, user_pk, _report_create)


@router.post("/update")
@author_chk.varify_access_token
def report_update(report_id: int, 
                  _report_update: ReportUpdate, 
                  access_token:str = Header(None),
                  user_pk:int = None,
                  db: Session = Depends(get_db)):
    try:
        report_crud.update_report(db, _report_update, report_id, user_pk)
    except:
        raise HTTPException(status_code=500, detail='UpdateNtError')
    
    
@router.post("/delete")
@author_chk.varify_access_token
def report_delete(report_id: int,
                  access_token:str = Header(None),
                  user_pk:int = None,
                  db: Session = Depends(get_db)):
    
    try:
        report_crud.delete_report(db, report_id, user_pk)
    except:
        raise HTTPException(status_code=500, detail='DeleteNtError')
    
   