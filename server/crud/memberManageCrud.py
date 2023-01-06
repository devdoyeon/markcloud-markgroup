from model import memberManageModel
from router import author_chk

from fastapi import HTTPException
from sqlalchemy import desc
from datetime import datetime,date
    
##################################부서 관리##################################

def get_department_list(db, offset, limit, user_info):
    
    department_table = memberManageModel.DepartmentTable
    
    try:
        
        query = db.query(department_table.id,
                        department_table.department_name.label('section'),
                        department_table.created_at
                        ).filter(department_table.organ_code == user_info.department_code
                        ).order_by(department_table.id)
        
        total_count = query.count()
        department_list = query.offset(offset).limit(limit).all()
        
        return total_count, department_list
    except:
        raise HTTPException(status_code=500, detail='GetDpError')


def get_department_info(db,department_id, user_info):
    
    department_table = memberManageModel.DepartmentTable
    
    try:
        return db.query(department_table.id,
                        department_table.department_name.label('section'),
                        department_table.created_at
                        ).filter(department_table.id == department_id
                        ).filter(department_table.organ_code == user_info.department_code
                        ).first()
    except:
        raise HTTPException(status_code=500, detail='GetDpInfoError')

def insert_department(db, inbound_data, user_info):
    
    department_table = memberManageModel.DepartmentTable

    try:
        
        dp_chk = db.query(department_table).filter(department_table.department_name == inbound_data.department_name).first()
        
        if dp_chk:
            return 500
        else:
            db_query = department_table(
            department_name=inbound_data.department_name,
            organ_code = user_info.department_code,
            created_id = user_info.id)
            
            db.add(db_query)
    except:
        raise HTTPException(status_code=500, detail='InsertDpError')
    

def change_department(db, inboud_data, department_id, user_info):
    
    department_table = memberManageModel.DepartmentTable
    member_table = memberManageModel.MemberTable
    
    try:
        values = {'department_name':inboud_data.department_name,
                  'updated_at':datetime.today()}
        
        # department_id로 기존 부서명 가져오기 
        origin_dpname = db.query(department_table.department_name).filter(department_table.id == department_id).first() 
        
        db.query(department_table
                ).filter_by(id = department_id
                ).filter(department_table.organ_code == user_info.department_code
                ).update(values)
        
        # 부서 수정시 member table의 section 이 새로운 부서명으로 업데이트 
        values =  {'section':inboud_data.department_name,
                  'updated_at':datetime.today()}
        
        db.query(member_table).filter(member_table.section == origin_dpname[0]).update(values)

    except:
        raise HTTPException(status_code=500, detail='ChangeDpERror')
    
def remove_department(db, department_id, user_info):
    
    department_table = memberManageModel.DepartmentTable
    member_table = memberManageModel.MemberTable
    
    try:
        
        # department_id로 기존 부서명 가져오기 
        origin_dpname = db.query(department_table.department_name).filter(department_table.id == department_id).first()
        
        db.query(department_table
                ).filter(department_table.id == department_id
                ).filter(department_table.organ_code == user_info.department_code
                ).delete()
        
        
        # 부서 삭제시 member table의 section -> '무소속'으로 업데이트
        values =  {'section':'무소속',
            'updated_at':datetime.today()}
        
        db.query(member_table).filter(member_table.section == origin_dpname[0]).update(values)        
                
    except:
        raise HTTPException(status_code=500, detail='RemoveDpError')
    

##################################직원 관리##################################
def get_member_list(db, offset,limit, user_info):
    
    member_table = memberManageModel.MemberTable
    
    try:
        query = db.query(member_table
                ).filter(member_table.department_code == user_info.department_code
                ).filter(member_table.is_active == 1
                ).order_by(member_table.id)
        
        total_count = query.count()
        member_list = query.offset(offset).limit(limit).all()

        return total_count, member_list
    except:
        raise HTTPException(status_code=500, detail='GetMbError')
    
    
def get_member_info(db,member_id):
    
    member_table = memberManageModel.MemberTable
    
    try:
        department_info = db.query(member_table).filter(member_table.id == member_id).first()
        return department_info
    
    except:
        raise HTTPException(status_code=500, detail='GetMbInfoError')    


def insert_member(db,inbound_data,user_info):

    member_table = memberManageModel.MemberTable

    try:
        # admin 정보
        hashed_password = author_chk.get_hashed_password(inbound_data.password)
        
        db_query = member_table(
            name = inbound_data.name,
            user_id = inbound_data.user_id,
            hashed_password = hashed_password,
            email = inbound_data.email,
            birthday = inbound_data.birthday,
            phone = inbound_data.phone,
            gender= inbound_data.gender,
            zip_code = inbound_data.zip_code,
            address = inbound_data.address,
            department = user_info.department,
            department_code = user_info.department_code,
            section = inbound_data.section,
            groupware_only_yn = "Y")

        db.add(db_query)

    except Exception:
        raise HTTPException(status_code=500, detail='InsertMbError')

def change_member(db, inbound_data, member_id):
    
    member_table = memberManageModel.MemberTable
    
    try:

        values = {'name':inbound_data.name,
                'user_id':inbound_data.user_id,
                'email':inbound_data.email,
                'section':inbound_data.section,
                'birthday':inbound_data.birthday,
                'phone':inbound_data.phone,
                'gender':inbound_data.gender,
                'address':inbound_data.address,
                'zip_code':inbound_data.zip_code,
                'updated_at':datetime.today()
                }
        
        db.query(member_table).filter_by(id = member_id).update(values)
    
    except:
        raise HTTPException(status_code=500, detail='ChangeMbError')


    
def remove_member(db,member_id):
    
    member_table = memberManageModel.MemberTable
    
    values = {'is_active': 0,
              'section':'퇴사'}
    
    db.query(member_table).filter(member_table.id == member_id).update(values)
