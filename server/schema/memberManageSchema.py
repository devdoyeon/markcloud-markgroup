from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta, date
from enum import Enum
from model import memberManageModel

class DepartmentOut(BaseModel):
    
    id:int # 번호
    section:str # 부서명
    created_at:date # 등록일시

    class Config:
        orm_mode = True

class DepartmentIn(BaseModel):
    
    department_name:str
    
    
###############################################################
    
class MemberOut(BaseModel):

    id:int
    user_id:str
    name:str
    section:Optional[str]
    phone:str
    email:str
    birthday:date

    class Config:
        orm_mode = True

class Memberinfo(BaseModel):
    
    id:int
    user_id:str
    name:str
    gender:str
    birthday:date
    section:Optional[str]
    phone:str
    email:str
    address:str
    zip_code:str
    
    class Config:
        orm_mode = True

class MemberIn(BaseModel):
    
    name:str
    user_id:str
    password:str
    email:str
    birthday:date
    phone:str
    gender:str
    zip_code:Optional[str]
    address:Optional[str]
    section:str
    
    class Config:
        orm_mode = True
