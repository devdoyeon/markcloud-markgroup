from sqlalchemy.orm import Session
from fastapi import HTTPException
from starlette import status
from datetime import datetime

from models import BusinessReportTable
from model.memberManageModel import *
from router import security
from schema.report_schema import ReportCreate, ReportUpdate

from crud import utils


def get_report_list(db: Session, 
                    filter_type: str, 
                    filter_val: str, 
                    offset: int, 
                    limit: int, 
                    user_pk: int):
    
    user_info = security.get_user_info(db, user_pk)
    
    report_list = db.query(BusinessReportTable.id, 
                            BusinessReportTable.created_at, 
                            MemberTable.name.label('created_id'), 
                            BusinessReportTable.title
            ).filter(BusinessReportTable.organ_code == user_info.department_code
            ).join(MemberTable, BusinessReportTable.created_id == MemberTable.id
            ).order_by(BusinessReportTable.id.desc())
            
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


def get_report(db: Session, report_id: int, user_info):
    report = db.query(BusinessReportTable.title, 
                      BusinessReportTable.created_at, 
                      BusinessReportTable.updated_at, 
                      BusinessReportTable.content, 
                      MemberTable.name.label('created_id'),
                      BusinessReportTable.img_url
                      ).filter(BusinessReportTable.id == report_id
                      ).filter(BusinessReportTable.organ_code == user_info.department_code
                    ).join(MemberTable,BusinessReportTable.created_id == MemberTable.id).first()
    print(report)
    return report


def create_report(db: Session, report_create: ReportCreate, file, user_info):
    if file:
        img_url = utils.get_s3_url(file, 'report')
    else:
        img_url = None
    
    db_report = BusinessReportTable(
        organ_code=user_info.department_code,
        title=report_create.title,
        content=report_create.content,
        created_at=datetime.now(),
        created_id=user_info.id,
        updated_at=datetime.now(),
        img_url = img_url
    )
    
    db.add(db_report)
    db.flush()
    
    return img_url


def update_report(
    db: Session,
    report_id: int,
    report_update: ReportUpdate,
    file,
    user_info
):
    db_report = db.query(BusinessReportTable).filter(BusinessReportTable.id == report_id).first()
    
    update_values = {
        "title": report_update.title,
        "content": report_update.content,
        "updated_at": datetime.now(),
        "updated_id": user_info.id
    }
    
    if user_info.id == db_report.created_id or user_info.groupware_only_yn == 'N':
        
        if report_update.url and file:
            print("1+1")
            origin_url = ','.join(report_update.url)
            img_url = utils.get_s3_url(file, 'report')
            update_values['img_url'] = origin_url + ',' + img_url
        
        elif report_update.url:
            print("1+0")
            origin_url = ','.join(report_update.url)
            update_values['img_url'] = origin_url
            
        elif file:
            print("0+1")
            img_url = utils.get_s3_url(file, 'report')
            update_values['img_url'] = img_url
        
        result = db.query(BusinessReportTable).filter_by(id = report_id).update(update_values)
        return result
    else:
        raise HTTPException(status_code=422, detail='InvalidClient')


def delete_report(db: Session, report_id: int, user_pk: int):
    
    user_info = security.get_user_info(db, user_pk)

    db_report = db.query(BusinessReportTable).filter(BusinessReportTable.id == report_id)    
    
    if user_pk == db_report.first().created_id or user_info.groupware_only_yn == 'N':
        db_report.delete()
    else:
        raise HTTPException(status_code=422, detail='InvalidClient')