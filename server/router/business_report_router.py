from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from starlette import status

from server.database import get_db
from server.schemas.base_schema import Response, filterType
from server.schemas.report_schema import BusinessReport, ReportListOut, ReportOut, ReportCreate, ReportUpdate
from server.crud import report_crud
from server import utils


router = APIRouter(prefix="/report")


@router.get("/list", response_model=Response[List[ReportListOut]])
def report_list(filter_type: Optional[filterType] = None,
                filter_val: Optional[str] = None,
                user_id: str = "mxxvii",     # 로그인한 사용자의 아이디.
                page: int = 1,
                limit: int = 5,
                db: Session = Depends(get_db)):
    offset = (page - 1) * limit
    total, _report_list = report_crud.get_report_list(db, filter_type, filter_val, offset, limit, user_id)
    totalPage = total // limit
    if total % limit != 0:
        totalPage += 1
    
    print(f"r e p o r t  l i s t  c o u n t :  {total}")
    
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
def report_create(_report_create: ReportCreate, user_id: str = "mxxvii", db: Session = Depends(get_db)):
    report_crud.create_report(db, user_id, _report_create)
    

@router.post("/update")
def report_update(report_id: int, _report_update: ReportUpdate, user_id: str = "mxxvii", db: Session = Depends(get_db)):
    
    # get_current_user
    
    _db_report = report_crud.get_report(db, report_id)
    if not _db_report:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="데이터를 찾을 수 없습니다.")
    
    if user_id != _db_report.created_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="수정 권한이 없습니다.")
        
    report_crud.update_report(db, _db_report, _report_update, user_id)
    

@router.post("/delete")
def report_delete(report_id: int, user_id: str = "mxxvii", db: Session = Depends(get_db)):
    
    _db_report = report_crud.get_report(db, report_id)
    
    if not _db_report:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="데이터를 찾을 수 없습니다.")
    
    if user_id != _db_report.created_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="삭제 권한이 없습니다.")
    
    report_crud.delete_report(db=db, db_report=_db_report)