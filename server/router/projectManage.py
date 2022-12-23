# 업무관리
from fastapi import APIRouter, Depends,Header
from sqlalchemy.orm import Session
from typing import Optional,List


from database import *
from crud.projectManageCrud import *
from schema.projectManageSchema import *
from schema.responseSchema import *

router_project = APIRouter(
    prefix="/projects",
    tags=["Project Manage API"]
)

# 프로젝트 관련 데이터 
@router_project.get('/read',response_model = Response[List[ProjectManageOut]])
@author_chk.varify_access_token
@author_chk.user_chk
def read_projects(
    access_token: str = Header(None),
    user_pk: int = None,
    user_info:str = None,
    project_name: Optional[str] = None,
    status_filter:str = "MyProject",
    page: int = 1,
    limit: int = 10,
    db:Session = Depends(get_db)
):
    
    try:
        offset = (page - 1) * limit
        total_count, project_list = get_project_list(db, offset, limit, user_info, status_filter) # 나의 업무현황 데이터
        total_page = total_count // limit
        

        if total_count % limit != 0:
            total_page += 1
        all_project_name = get_project_name(db,user_info) # 전체 프로젝트명 
        project_member = get_project_member(db,project_name) # 요청자 & 담당자
    
        
        return Response().metadata(
            project_name = all_project_name,
            project_member = project_member,
            page=page,
            totalPage=total_page,
            offset=offset,
            limit=limit
        ).success_response(project_list)
        
    except:
        raise HTTPException(status_code=500, detail='ReadPjtError')


# 프로젝트 필터 
@router_project.post('/filter_read', response_model = Response[List[ProjectManageOut]])
@author_chk.varify_access_token
@author_chk.user_chk
def read_project_list(
    access_token: str = Header(None),
    filter_data: Optional[ProjectManageFilter] = None,
    status_filter: Optional[ProjectManageStatusFilter] = 'MyProject',
    user_pk: int = None,
    user_info:str= None,
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    try:
        offset = (page - 1) * limit
        total_count, project_list = get_project_list(db, offset, limit, user_info ,status_filter, filter_data)
        total_page = total_count // limit

        
        if total_count % limit != 0:
            total_page += 1
        
        return Response().metadata(
            page=page,
            totalPage=total_page,
            offset=offset,
            limit=limit
        ).success_response(project_list)
    except:
        raise HTTPException(status_code=500, detail='ReadPjtFilterError')
    
# 프로젝트 상세페이지
@router_project.get('/info', response_model = ProjectManageOut)
@author_chk.varify_access_token
@author_chk.user_chk
def read_project_info(
    project_id:int,
    access_token:str = Header(None),
    user_pk:int = None,
    user_info:str = None,
    db: Session = Depends(get_db)
):
    try:
        result = get_project_info(db,project_id,user_info)
        return result
    except:
        raise HTTPException(status_code=500, detail='ReadPjtInfoError')
    
# 프로젝트 생성
@router_project.post('/create')
@author_chk.varify_access_token
def create_project(
    inbound_data: ProjectManageIn,
    access_token: str = Header(None),
    user_pk:int = None,
    user_info:str = None,
    db: Session = Depends(get_db),
):
    try:
        insert_project(db,inbound_data, user_info)
    except:
        raise HTTPException(status_code=500, detail='CreatePjtError')
    
# 프로젝트 수정
@router_project.post('/update')
@author_chk.varify_access_token
@author_chk.user_chk
def update_project(
    inbound_data:ProjectManageEditDTO,
    project_id:int,
    access_token: str = Header(None),
    user_pk:int = None,
    user_info:str = None,
    db:Session = Depends(get_db)
):
    try:
        change_project(db,inbound_data,project_id,user_info)
    except:
        raise HTTPException(status_code=500, detail='UpdatePjtError')
    
# 프로젝트 삭제    
@router_project.post('/delete')
@author_chk.varify_access_token
@author_chk.user_chk
def delete_project(
    project_id:int,
    access_token: str = Header(None),
    user_pk:int = None,
    user_info:str = None,
    db:Session = Depends(get_db)
):
    try:
        remove_project(db,project_id,user_info)
    except:
        raise HTTPException(status_code=500, detail='DeletePjtError')