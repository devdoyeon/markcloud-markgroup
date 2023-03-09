from sqlalchemy.orm import Session
from fastapi import HTTPException

from datetime import date

from model.intellectualPropertyModel import *
from schema.ip_schema import IPCreate, IPUpdate
from router import security


def get_ip_list(db: Session,
                offset: int, 
                limit: int, 
                user_info: str
                ):
    ip_list = db.query(IntellectualPropertyTable
                       ).filter(IntellectualPropertyTable.organ_code == user_info.department_code)
    total = ip_list.count()
    ip_list = ip_list.order_by(IntellectualPropertyTable.id.desc()).offset(offset).limit(limit).all()
    return total, ip_list


def get_ip(db: Session, ip_id: int):
    ip = db.query(IntellectualPropertyTable).filter(IntellectualPropertyTable.id == ip_id).first()
    return ip


def create_ip(db: Session, user_pk: int, ip_create: IPCreate):
    user_info = security.get_user_info(db, user_pk)
    db_ip = IntellectualPropertyTable(        
        organ_code = user_info.department_code,
        rights = ip_create.rights,
        application_date = ip_create.application_date,
        application_number = ip_create.application_number,
        applicant = ip_create.applicant,
        status = ip_create.status,
        name_kor = ip_create.name_kor,
        name_eng = ip_create.name_eng,
        product_code = ip_create.product_code,
        registration_date = ip_create.registration_date,
        registration_number = ip_create.registration_number
    )
    result = db.add(db_ip)
    return result


def update_ip(db: Session, ip_id: int, ip_update: IPUpdate, user_info):
    update_values = {
        "organ_code": user_info.department_code,
        "rights": ip_update.rights,
        "application_date": ip_update.application_date,
        "application_number": ip_update.application_number,
        "applicant": ip_update.applicant,
        "status": ip_update.status,
        "name_kor": ip_update.name_kor,
        "name_eng": ip_update.name_eng,
        "product_code": ip_update.product_code,
        "registration_date": ip_update.registration_date,
        "registration_number": ip_update.registration_number
    }
    
    result = db.query(IntellectualPropertyTable).filter_by(id = ip_id).update(update_values)
    return result


def delete_ip(db: Session, ip_id:int):
    db_ip = db.query(IntellectualPropertyTable).filter(IntellectualPropertyTable.id == ip_id).first()
    db.delete(db_ip)