from pydantic import BaseModel
from typing import Optional

from datetime import date


class Board(BaseModel):
    id: str
    organ_code: str
    title: str
    content: str
    created_at: date
    created_id: str
    updated_at: Optional[date] = None
    updated_id: Optional[str] = None
    
    class Config:
        orm_mode = True


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
    
    class Config:
        orm_mode = True

        

class PostCreate(BaseModel):
    title: str
    content: str
    # created_id: str # current_user id 자동으로 가져와야함.


class PostUpdate(BaseModel):
    title: str
    content: str
    # created_id: str # 필요 없는 것 같은데 확인하기.
    

# class PostDelete(BaseModel):
#     post_id: int