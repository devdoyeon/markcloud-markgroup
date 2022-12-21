from pydantic import BaseModel
from typing import Optional

from datetime import date


class Project(BaseModel):
    id: str
    organ_code: str
    project_code: str
    project_name: str
    project_description: Optional[str] = None
    project_start_date: date
    project_end_date: date
    project_status: str
    created_at: date
    created_id: str
    updated_at: Optional[date] = None
    updated_id: Optional[str] = None
    
    class Config:
        orm_mode = True
        

class ProjectListOut(BaseModel):
    id: str
    project_name: str
    project_start_date: date
    project_end_date: date
    project_status: str
    project_code: str
    member_cnt: int
    
    class Config:
        orm_mode = True
        

class ProjectOut(BaseModel):
    id: str
    project_name: str
    project_start_date: date
    project_end_date: date
    project_status: str
    
    class Config:
        orm_mode = True
        

class ProjectMemberListOut(BaseModel):
    user_id: str
    
    class Config:
        orm_mode = True
    

class ProjectCreate(BaseModel):
    project_name: str
    project_description: Optional[str] = None
    project_start_date: date
    project_end_date: date
    project_status: str
    
    class Config:
        orm_mode = True
        
        
class ProjectUpdate(BaseModel):
    project_name: str
    project_description: Optional[str] = None
    project_start_date: date
    project_end_date: date
    project_status: str
    
    class Config:
        orm_mode = True


class ProjectMemberAdd(BaseModel):
    new_member_id: str  
    

class ProjectMemberDelete(BaseModel):
    delete_member_id: str  
