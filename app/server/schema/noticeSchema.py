from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

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
        
class NoticeOut(BaseModel):
    
    id:int
    title:str
    content:str
    organ_code:str
    created_id:str

    class Config:
        orm_mode = True
