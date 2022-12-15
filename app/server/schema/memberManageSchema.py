from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta, date
from enum import Enum

class DepartmentOut(BaseModel):
    
    id:int # 번호
    department_name:str # 부서명
    created_at:date # 등록일시

    class Config:
        orm_mode = True
    
    
class MemberOut(BaseModel):

    id:int
    user_id:str
    name:str
    department:str
    phone:str
    email:str
    created_at:date
    birthday:date

    class Config:
        orm_mode = True

class MemberIn(BaseModel):
    
    name:str
    user_id:str
    hashed_password:str
    email:str
    birthday:date
    phone:int
    gender:str
    address:Optional[str] = ""
    
    
    
    
    
    
    
    
    
    
    
    
    class Config:
        orm_mode = True
    