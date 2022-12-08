from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class NoticeIn(BaseModel):
    
    id:int
    title:str
    content:str
    company:str
    created_at:Optional[datetime]
    created_id:str
    updated_at:Optional[datetime]

    class Config:
        orm_mode = True
        
class NoticeOut(BaseModel):
    
    id:int
    title:str
    content:str
    company:str
    created_id:str

    class Config:
        orm_mode = True
