from sqlalchemy.orm import Session
from fastapi import HTTPException
from starlette import status

from datetime import datetime

from models import BusinessReportTable, OrganizationTable
from model import memberManageModel
from schema.report_schema import ReportCreate, ReportUpdate
import utils

member_table = memberManageModel.MemberTable
organization_table = OrganizationTable

# 사용자계정으로 로그인 시, 본인이 작성한 주간업무보고만 리스트에 보여져야 함.
# 대표계정의 경우 모든 주간업무보고 노출.
def get_report_list(db: Session, filter_type: str, filter_val: str, offset: int, limit: int, user_id: str):
    
    try:
        query = db.query(BusinessReportTable)
        report_list = query.join(memberManageModel.MemberTable, BusinessReportTable.organ_code == memberManageModel.MemberTable.department_code).filter(memberManageModel.MemberTable.user_id == user_id)
        
        # user_id의 회사 대표계정 id 가져오기
        owner_id = db.query(OrganizationTable.owner_user_id).filter(memberManageModel.MemberTable.user_id == user_id).first()
        # print(owner_id)
        # print("===")
        owner_id = owner_id[0]
        
        if user_id == owner_id:
            print("대표 계정")
        else:
            print(" = = = = = 사용자 계정 = = = = = ")
            report_list = report_list.filter(BusinessReportTable.created_id == user_id)
            
            
        if filter_type:
            search = f'%%{filter_val}%%'
            if filter_type == "title":
                report_list = report_list.filter(BusinessReportTable.title.ilike(search))
            if filter_type == "created_id":
                report_list = report_list.filter(BusinessReportTable.created_id.ilike(search))
        total = report_list.distinct().count()
        print(f"t o t a l :: {total}")
        report_list = report_list.order_by(BusinessReportTable.created_at.desc()).offset(offset).limit(limit).all()
        return total, report_list
    
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")


def get_report(db: Session, report_id: int):
    report = db.query(BusinessReportTable).get(report_id)
    return report


def create_report(db: Session, user_id: str, report_create: ReportCreate):
    try:
        # user_id의 회사 코드 가져오기
        organ_code = utils.get_organ_code(db, user_id)
        
        db_report = BusinessReportTable(organ_code=organ_code,
                                title=report_create.title,
                                content=report_create.content,
                                created_at=datetime.now(),
                                created_id=user_id,
                                # created_id=report_create.created_id,
                                updated_at=datetime.now(),
                                updated_id=user_id
                                )
        db.add(db_report)
        db.commit()
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")


def update_report(db: Session, db_report: BusinessReportTable, report_update: ReportUpdate, user_id: str):
    try:
        db_report.title = report_update.title
        db_report.content = report_update.content
        db_report.updated_at = datetime.now()
        db_report.updated_id = user_id
        db.add(db_report)
        db.commit()
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")
    
    
def delete_report(db: Session, db_report: BusinessReportTable):
    try:
        db.delete(db_report)
        db.commit()
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")
