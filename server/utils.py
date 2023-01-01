from sqlalchemy.orm import Session
from fastapi import HTTPException
from starlette import status

from model import memberManageModel
from models import OrganizationTable


def get_organ_code(db: Session, user_id: str):
    try:
        sql = db.query(memberManageModel.MemberTable.department_code).filter(memberManageModel.MemberTable.user_id == user_id)
        organ_code = db.execute(sql).all()
        organ_code = [i for i, in organ_code]
        return organ_code
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


def get_owner_id(db: Session, user_id: str):
    try:  
        # user_id의 회사 코드 가져오기
        sql = db.query(memberManageModel.MemberTable.department_code).filter(memberManageModel.MemberTable.user_id == user_id)
        user_organ_code = db.execute(sql).all()
        user_organ_code = [i for i, in user_organ_code]
        
        # user_id의 회사의 대표 계정 id 가져오기
        sql_owner_id = db.query(OrganizationTable.owner_user_id).filter(OrganizationTable.organ_code==user_organ_code)
        owner_id = db.execute(sql_owner_id).all()
        owner_id = [i for i, in owner_id]
        return owner_id[0]        
    
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)