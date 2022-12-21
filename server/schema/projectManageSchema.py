from pydantic import BaseModel
from typing import Optional,List, Union
from enum import Enum
from datetime import date


class ProjectManageIn(BaseModel):
    
    project_name:str # 프로젝트명
    title:str # 제목
    content:str # 내용
    work_status:str # 진행상태
    request_id:str # 요청자
    manager_id:str # 담당자
    
    class Config:
        orm_mode = True

class ProjectManageStatusFilter(Enum):
    
    All = "All" # 전체 업무 현황
    MyProject = "MyProject" # 나의 업무현황
    MyRequest = "MyRequest" # 내가 요청한 업무
    
class ProjectManageFilter(BaseModel):
    
    project_name:str
    manager_id:str
    request_id:str
    title:str
    content:str
    progress_status:list
    
    class Config:
        orm_mode = True

    
class ProjectManageEditDTO(BaseModel):
    
    request_id:str
    manager_id:str
    work_status:str
    title:str
    content:str

class ProjectManageOut(BaseModel):
    
    id:int # 번호
    title:str # 제목
    content:str
    project_name:str#프로젝트명
    request_id:str # 요청자
    manager_id:str # 담당자
    work_status:str #진행상태
    created_at:date # 작성일
    work_end_date:Optional[date] # 완료일자
        
    class Config:
        orm_mode = True
    
class ProjectData(str):
    
    project_name: str
