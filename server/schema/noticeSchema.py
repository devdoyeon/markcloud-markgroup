from pydantic import BaseModel
from typing import Optional, Union
from datetime import datetime, date
from enum import Enum

class NoticeIn(BaseModel):
    
    title:str
    content:str

    class Config:
        orm_mode = True
        
class NoticeFilter(str, Enum):
    
    all = "all"
    title =  "title"
    created_id = "created_id"
    
class NoticeEditDTO(BaseModel):
    
    title:str
    content:str
    
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
    created_at:date
    updated_at:date
    content:str
    img_url:Union[str,list]
    
    class Config:
        orm_mode = True