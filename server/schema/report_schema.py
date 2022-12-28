from pydantic import BaseModel
from typing import Optional

from datetime import date


class BusinessReport(BaseModel):
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
        

class ReportListOut(BaseModel):
    id: str
    title: str
    created_id: str
    created_at: date
    
    class Config:
        orm_mode = True
        

class ReportOut(BaseModel):
    title: str
    content: str
    created_at: date
    created_id: str
    updated_at: date
    
    class Config:
        orm_mode = True
        

class ReportCreate(BaseModel):
    title: str
    content: str


class ReportUpdate(BaseModel):
    title: str
    content: str
