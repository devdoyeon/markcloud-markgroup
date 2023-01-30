from pydantic import BaseModel
from typing import Optional

from datetime import date


class BoardOut(BaseModel):
    id: str
    title: str
    created_id: str
    created_at: date
    
    class Config:
        orm_mode = True
        

class PostOut(BaseModel):
    title: str
    content: str
    created_at: date
    created_id: str
    updated_at: Optional[date] = None
    user_pk: int
    img_url: Optional[list]
    
    class Config:
        orm_mode = True
        

class PostCreate(BaseModel):
    title: str
    content: str


class PostUpdate(BaseModel):
    title: str
    content: str
    url: Optional[list]