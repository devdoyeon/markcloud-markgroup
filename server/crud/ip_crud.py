from sqlalchemy.orm import Session
from fastapi import HTTPException

from datetime import datetime, date

from model.intellectualPropertyModel import *
from model.memberManageModel import *
from schema.ip_schema import IPListIn, IPInput
from router import security


def get_ip_list(db: Session,
                ip_list_in: IPListIn,
                offset: int, 
                limit: int, 
                user_info: str
                ):
    ip_list = db.query(IntellectualPropertyTable
                       ).filter(IntellectualPropertyTable.organ_code == user_info.department_code)
    if ip_list_in.rights and ip_list_in.rights != "all":
        ip_list = ip_list.filter(IntellectualPropertyTable.rights == ip_list_in.rights)
    if ip_list_in.application_number:
        ip_list = ip_list.filter(IntellectualPropertyTable.application_number == ip_list_in.application_number)
    if ip_list_in.application_start_date:
        ip_list = ip_list.filter(IntellectualPropertyTable.application_date >= ip_list_in.application_start_date)
    if ip_list_in.application_end_date:
        ip_list = ip_list.filter(IntellectualPropertyTable.application_date <= ip_list_in.application_end_date)
    if ip_list_in.applicant:
        search_applicant = f'%%{ip_list_in.applicant}%%'
        ip_list = ip_list.filter(IntellectualPropertyTable.applicant.ilike(search_applicant))
    if ip_list_in.name_kor:
        search_name_kor = f'%%{ip_list_in.name_kor}%%'
        ip_list = ip_list.filter(IntellectualPropertyTable.name_kor.ilike(search_name_kor))
    if ip_list_in.product_code:
        search_product_code = f'%%{ip_list_in.product_code}%%'
        ip_list = ip_list.filter(IntellectualPropertyTable.product_code.ilike(search_product_code))
    if ip_list_in.registration_number:
        ip_list = ip_list.filter(IntellectualPropertyTable.registration_number == ip_list_in.registration_number)
    if ip_list_in.registration_start_date:
        ip_list = ip_list.filter(IntellectualPropertyTable.registration_date >= ip_list_in.registration_start_date)
    if ip_list_in.registration_end_date:
        ip_list = ip_list.filter(IntellectualPropertyTable.registration_date <= ip_list_in.registration_end_date)
    
    total = ip_list.count()
    ip_list = ip_list.order_by(IntellectualPropertyTable.id.desc()).offset(offset).limit(limit).all()
    return total, ip_list


def get_ip(db: Session, ip_id: int):
    ip = db.query(IntellectualPropertyTable.rights,
                IntellectualPropertyTable.application_date,
                IntellectualPropertyTable.application_number,
                IntellectualPropertyTable.applicant,
                IntellectualPropertyTable.ip_status,
                IntellectualPropertyTable.name_kor,
                IntellectualPropertyTable.name_eng,
                IntellectualPropertyTable.product_code,
                IntellectualPropertyTable.registration_date,
                IntellectualPropertyTable.registration_number,
                MemberTable.name.label('created_id'),
                IntellectualPropertyTable.created_at,
                ).filter(IntellectualPropertyTable.id == ip_id
                ).join(MemberTable, IntellectualPropertyTable.created_id == MemberTable.id).first()
    return ip


def create_ip(db: Session, user_info: int, ip_create: IPInput):
    db_ip = IntellectualPropertyTable(        
        organ_code = user_info.department_code,
        rights = ip_create.rights,
        application_date = ip_create.application_date,
        application_number = ip_create.application_number,
        applicant = ip_create.applicant,
        ip_status = ip_create.ip_status,
        name_kor = ip_create.name_kor,
        name_eng = ip_create.name_eng,
        product_code = ip_create.product_code,
        registration_date = ip_create.registration_date,
        registration_number = ip_create.registration_number,
        created_at = datetime.now(),
        created_id = user_info.id
    )
    result = db.add(db_ip)
    return result


def update_ip(db: Session, ip_id: int, user_info, ip_update: IPInput):
    update_values = {
        "organ_code": user_info.department_code,
        "rights": ip_update.rights,
        "application_date": ip_update.application_date,
        "application_number": ip_update.application_number,
        "applicant": ip_update.applicant,
        "ip_status": ip_update.ip_status,
        "name_kor": ip_update.name_kor,
        "name_eng": ip_update.name_eng,
        "product_code": ip_update.product_code,
        "registration_date": ip_update.registration_date,
        "registration_number": ip_update.registration_number,
        "updated_at": datetime.now(),
        "updated_id": user_info.id
    }    
    result = db.query(IntellectualPropertyTable).filter_by(id = ip_id).update(update_values)
    return result


def delete_ip(db: Session, ip_id:int):
    db_ip = db.query(IntellectualPropertyTable).filter(IntellectualPropertyTable.id == ip_id).first()
    db.delete(db_ip)