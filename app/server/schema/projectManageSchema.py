from pydantic import BaseModel
from enum import Enum

class ProjectManageFilter(str,Enum):
    
    All = "All" # 전체 업무현황
    MyProject = "MyProject" # 나의 업무현황
    MyRequest = "MyRequest" # 내가 요청한 업무

class ProjectManageOut(BaseModel):
    
    id:int # 번호
    project_name:str # 제목
    project_description:str # 프로젝트
    
    
    class Config:
        orm_mode = True
        
        