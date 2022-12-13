from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from enum import Enum

class NoticeIn(BaseModel):
    
    title:str
    content:str
    # organ_code:str
    created_id:str # 작성자
    # updated_at:Optional[datetime]
    # updated_id:Optional[str]

    class Config:
        orm_mode = True
        
class NoticeFilter(str, Enum):
    
    title =  "title"
    created_id = "created_id"
    
class NoticeOut(BaseModel):

    id:int
    created_at:date
    created_id:str
    title:str

    class Config:
        orm_mode = True

class NoticeInfo(BaseModel):
    
    title:str
    created_id:str
    created_at:Optional[date]
    updated_at:Optional[date]
    content:str
    
    class Config:
        orm_mode = True