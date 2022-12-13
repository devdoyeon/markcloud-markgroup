from model.memberManageModel import *
from fastapi import HTTPException

# 부서관리 리스트
def get_department_list(db, offset, limit):
    
    table = DepartmentTable
    
    try:
        department_list = db.query(table).offset(offset).limit(limit).all()
        return department_list
    except:
        raise HTTPException(status_code=500, detail='DBError')

def insert_department(db):
    pass





# 인사관리 리스트
def get_member_list(db, offset,limit):
    
    table = MemberTable
    
    try:
        member_list = db.query(table).offset(offset).limit(limit).all()

        return member_list
    except:
        raise HTTPException(status_code=500, detail='DBError')

