from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta, date
from enum import Enum

class DepartmentOut(BaseModel):
    
    id:int
    department_name:str
    created_at:date

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
