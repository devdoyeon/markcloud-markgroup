from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date
from enum import Enum

class NoticeIn(BaseModel):
    
    title:str
    content:str
    created_id:str # 작성자

    class Config:
        orm_mode = True
        
class NoticeFilter(str, Enum):
    
    all = "all"
    title =  "title"
    created_id = "created_id"
    
class NoticeEditDTO(BaseModel):
    
    title:str
    content:str
    created_id:str
    
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