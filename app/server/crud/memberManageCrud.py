from model import memberManageModel
from fastapi import HTTPException
from sqlalchemy import desc

# 부서 리스트
def get_department_list(db, offset, limit, user_id):
    
    department_table = memberManageModel.DepartmentTable
    member_table = memberManageModel.MemberTable
    
    try:
        # 부서 코드 확인
        user_organ_code = db.query(member_table.department_code).filter(member_table.user_id==user_id)
        query = db.query(department_table).filter(department_table.organ_code == user_organ_code).order_by(desc(department_table.id))
        
        total_count = query.count()

        department_list = query.offset(offset).limit(limit).all()
        return total_count, department_list
    except:
        raise HTTPException(status_code=500, detail='DBError')

def insert_department(db):
    pass


# 직원 리스트
def get_member_list(db, offset,limit):
    
    table = memberManageModel.MemberTable
    
    try:
        member_list = db.query(table).offset(offset).limit(limit).all()

        return member_list
    except:
        raise HTTPException(status_code=500, detail='DBError')

