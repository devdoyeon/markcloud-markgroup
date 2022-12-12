from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum

class NoticeIn(BaseModel):
    
    id:int
    title:str
    content:str
    organ_code:str
    created_at:Optional[datetime]
    created_id:str
    updated_at:Optional[datetime]
    updated_id:Optional[str]

    class Config:
        orm_mode = True
        
class NoticeFilter(str, Enum):
    
    title =  "title"
    created_id = "created_id"
    
class NoticeOut(BaseModel):

    id:str
    created_at:datetime
    created_id:str
    title:str

    class Config:
        orm_mode = True

class NoticeInfo(BaseModel):
    
    title:str
    created_id:str
    created_at:Optional[datetime]
    updated_at:Optional[datetime]
    content:str
    
    class Config:
        orm_mode = True