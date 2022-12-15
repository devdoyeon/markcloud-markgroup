from model import memberManageModel
from fastapi import HTTPException
from sqlalchemy import desc
from datetime import datetime

# 부서 리스트
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
    
# 직원 리스트
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

# 직원 등록
def insert_member(db,inbound_data, user_id):

    member_table = memberManageModel.MemberTable

    try:
        organ_code = db.query(member_table.department_code).filter(member_table.user_id == user_id).first()
        
        db_query = member_table(
            name = inbound_data.name,
            user_id = inbound_data.user_id,
            hashed_password = inbound_data.hashed_password,
            email = inbound_data.email,
            birthday = inbound_data.birthday,
            phone = inbound_data.phone,
            gender = inbound_data.gender,
            address=inbound_data.address,
            department_code = organ_code[0],
            groupware_only_yn = "Y")
        
        db.add(db_query)

    except:
        raise HTTPException(status_code=500, detail='DBError')

def change_member(db, inbound_data, member_id, user_id):
    
    member_table = memberManageModel.MemberTable
    
    try:
        values = {'user_id':inbound_data.title,
                'content':inbound_data.content,
                'created_id':user_id,
                'updated_at':datetime.today()
                }
    
        if user_id == 'songmoana': # 관리자만 가능
            base_q = db.query(member_table).filter_by(id = member_id).update(values)
        else:
            raise HTTPException(status_code=422, detail='InvalidClient')
    except:
        raise HTTPException(status_code=500, detail='DBError')
    
    

def remove_member(db,member_id,user_id):
    
    member_table = memberManageModel.MemberTable

    try:
        if user_id == 'songmoana': # 관리자일경우
            base_q = db.query(member_table).filter(member_table.user_id == member_id)
            base_q.delete()
        else:
            raise HTTPException(status_code=422, detail='InvalidClient')
        
    except:
        raise HTTPException(status_code=500, detail='DBError')            
    
