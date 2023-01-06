from sqlalchemy.orm import Session
from fastapi import HTTPException
from starlette import status
from datetime import datetime

from models import BusinessReportTable
from model.memberManageModel import *
from router import author_chk
from schema.report_schema import ReportCreate, ReportUpdate


def get_report_list(db: Session, filter_type: str, filter_val: str, offset: int, limit: int, user_pk: int):
    
    try:
        user_info = author_chk.get_user_info(db, user_pk)
                                    
        report_list = db.query(BusinessReportTable.id, BusinessReportTable.created_at, MemberTable.name.label('created_id'), BusinessReportTable.title) \
            .filter(BusinessReportTable.organ_code == user_info.department_code) \
                .join(MemberTable, BusinessReportTable.created_id == MemberTable.id).order_by(BusinessReportTable.id.desc())
                
        if user_info.groupware_only_yn == 'Y':    
            report_list = report_list.filter(BusinessReportTable.created_id == user_pk)
            
        if filter_type:
            search = f'%%{filter_val}%%'
            if filter_type == "title":
                report_list = report_list.filter(BusinessReportTable.title.ilike(search))
            if filter_type == "created_id":
                report_list = report_list.filter(MemberTable.name.ilike(search))
        total = report_list.distinct().count()
        print(f"t o t a l :: {total}")
        report_list = report_list.order_by(BusinessReportTable.created_at.desc()).offset(offset).limit(limit).all()
        return total, report_list
    
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")


def get_report(db: Session, report_id: int):
    
    report = db.query(BusinessReportTable.title, 
                      BusinessReportTable.created_at, 
                      BusinessReportTable.updated_at, 
                      BusinessReportTable.content, 
                      MemberTable.name.label('created_id')) \
            .filter(BusinessReportTable.id == report_id) \
                .join(MemberTable,BusinessReportTable.created_id == MemberTable.id).first()
    return report


def create_report(db: Session, user_pk: int, report_create: ReportCreate):
    try:
        user_info = author_chk.get_user_info(db, user_pk)
        
        db_report = BusinessReportTable(organ_code=user_info.department_code,
                                title=report_create.title,
                                content=report_create.content,
                                created_at=datetime.now(),
                                created_id=user_pk,
                                updated_at=datetime.now(),
                                updated_id=user_pk
                                )
        db.add(db_report)
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")

    
def update_report(db: Session, report_update: ReportUpdate, report_id: int, user_pk: int):
    user_info = author_chk.get_user_info(db, user_pk)
    
    update_values = {
        "title": report_update.title,
        "content": report_update.content,
        "updated_at": datetime.now(),
        "updated_id": user_pk
    }
    
    db_report = db.query(BusinessReportTable).filter(BusinessReportTable.id == report_id).first()
    
    if user_pk == db_report.created_id or user_info.groupware_only_yn == 'N':
        db.query(BusinessReportTable).filter_by(id = report_id).update(update_values)
    else:
        raise HTTPException(status_code=422, detail='InvalidClient')
    

def delete_report(db: Session, report_id: int, user_pk: int):
    
    user_info = author_chk.get_user_info(db, user_pk)

    db_report = db.query(BusinessReportTable).filter(BusinessReportTable.id == report_id)    
    
    if user_pk == db_report.first().created_id or user_info.groupware_only_yn == 'N':
        db_report.delete()
    else:
        raise HTTPException(status_code=422, detail='InvalidClient')