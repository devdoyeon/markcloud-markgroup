from model import memberManageModel
from fastapi import HTTPException
from sqlalchemy import desc
from datetime import datetime,date


    
##################################부서 관리##################################
def get_department_list(db, offset, limit, user_id):
    
    department_table = memberManageModel.DepartmentTable
    member_table = memberManageModel.MemberTable
    
    try:
        user_organ_code = db.query(member_table.department_code).filter(member_table.user_id==user_id)
        query = db.query(department_table).filter(department_table.organ_code == user_organ_code).order_by(department_table.id)
                
        total_count = query.count()
        department_list = query.offset(offset).limit(limit).all()
        return total_count, department_list
    except:
        raise HTTPException(status_code=500, detail='DBError')


def get_department_info(db,department_id):
    
    department_table = memberManageModel.DepartmentTable
    
    try:
        department_info = db.query(department_table).filter(department_table.id == department_id).first()
        return department_info
    
    except:
        raise HTTPException(status_code=500, detail='DBError')

def insert_department(db, inbound_data, user_id):
    
    department_table = memberManageModel.DepartmentTable
    member_table = memberManageModel.MemberTable

    try:
        user_organ_code = db.query(member_table.department_code).filter(member_table.user_id==user_id).first()
                
        db_query = department_table(
        department_name=inbound_data.department_name,
        organ_code = user_organ_code[0],
        created_id=user_id)
        
        db.add(db_query)

    except:
        raise HTTPException(status_code=500, detail='DBError')
    

def change_department(db, inboud_data,department_id):
    
    department_table = memberManageModel.DepartmentTable
    
    try:
        values = {'department_name':inboud_data.department_name,
                  'updated_at':datetime.today()}
        db.query(department_table).filter_by(id = department_id).update(values)
    except:
        raise HTTPException(status_code=500, detail='DBError')
    
def remove_department(db, department_id):
    
    department_table = memberManageModel.DepartmentTable
    
    try:
        db.query(department_table).filter(department_table.id == department_id).delete()
    except:
        raise HTTPException(status_code=500, detail='DBError')
    
    
    
##################################직원 관리##################################
def get_member_list(db, offset,limit, user_id):
    
    member_table = memberManageModel.MemberTable
    
    try:
        user_organ_code = db.query(member_table.department_code).filter(member_table.user_id==user_id)
        query = db.query(member_table).filter(member_table.department_code == user_organ_code).order_by(member_table.id)
        
        total_count = query.count()
        member_list = query.offset(offset).limit(limit).all()
        return total_count, member_list
    except:
        raise HTTPException(status_code=500, detail='DBError')
    
    
def get_member_info(db,member_id):
    
    member_table = memberManageModel.MemberTable
    
    try:
        department_info = db.query(member_table).filter(member_table.id == member_id).first()
        return department_info
    
    except:
        raise HTTPException(status_code=500, detail='DBError')    


def insert_member(db,inbound_data, user_id):

    member_table = memberManageModel.MemberTable

    try:
        # 기업코드, 기업명
        organ_code = db.query(member_table.department_code,member_table.department).filter(member_table.user_id == user_id).first() 
        
        db_query = member_table(
            name = inbound_data.name,
            user_id = inbound_data.user_id,
            hashed_password = inbound_data.hashed_password,
            email = inbound_data.email,
            birthday = inbound_data.birthday,
            phone = inbound_data.phone,
            gender= inbound_data.gender,
            zip_code = inbound_data.zip_code,
            address = inbound_data.address,
            department = organ_code[1],
            department_code = organ_code[0],
            section = inbound_data.section,
            groupware_only_yn = "Y")

        db.add(db_query)

    except:
        raise HTTPException(status_code=500, detail='DBError')

def change_member(db, inbound_data, member_id):
    
    member_table = memberManageModel.MemberTable
    
    try:
        values = {'name':inbound_data.name,
                'user_id':inbound_data.user_id,
                'hashed_password':inbound_data.hashed_password,
                'email':inbound_data.email,
                'section':inbound_data.section,
                'birthday':inbound_data.birthday,
                'phone':inbound_data.phone,
                'gender':inbound_data.gender,
                'address':inbound_data.address,
                'zip_code':inbound_data.zip_code,
                'updated_at':datetime.today()
                }
                # if user_id == 'songmoana': # 관리자만 가능
        db.query(member_table).filter_by(id = member_id).update(values)

        # else:
            # raise HTTPException(status_code=422, detail='InvalidClient')
    except:
        raise HTTPException(status_code=500, detail='DBError')


    
def remove_member(db,member_id):
    
    member_table = memberManageModel.MemberTable

    try:
        db.query(member_table).filter(member_table.id == member_id).delete()
    except:
        raise HTTPException(status_code=500, detail='DBError')            
    
