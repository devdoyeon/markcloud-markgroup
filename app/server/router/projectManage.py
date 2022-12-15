# 업무관리
from fastapi import APIRouter, Depends,Query
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

# 프로젝트 전체 목록
@router_project.get('/read',response_model = Response[List[ProjectManageOut]])
def read_projects(
    user_id: str='songmoana',
    page: int = 1,
    limit: int = 10,
    db:Session = Depends(get_db)
):
    
    offset = (page - 1) * limit
    total_count, project_list = get_project_list(db, offset, limit, user_id) # 나의 업무현황 데이터
    total_page = total_count // limit
    
    if total_page % limit != 0:
        total_page += 1
    
    project_name, member_id = get_project_data(db,user_id)
    
    return Response().metadata(
        project_name = project_name,
        member_id = member_id,
        page=page,
        totalPage=total_page,
        offset=offset,
        limit=limit
    ).success_response(project_list)

    

# 프로젝트 필터링 목록
@router_project.post('/filter_read', response_model = Response[List[ProjectManageOut]])
def read_project_list(
    filter_data: Optional[ProjectManageFilter] = None,
    status_filter: Optional[ProjectManageStatusFilter] = 'MyProject',
    user_id: str = 'songmoana',
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit
    total_count, project_list = get_project_list(db, offset, limit, user_id ,status_filter, filter_data)
    total_page = total_count // limit
    
    if total_page % limit != 0:
        total_page += 1
    
    return Response().metadata(
        page=page,
        totalPage=total_page,
        offset=offset,
        limit=limit
    ).success_response(project_list)
    
# 프로젝트 상세페이지
@router_project.get('/info', response_model = ProjectManageOut)
def read_project_info(
    project_id:int,
    db: Session = Depends(get_db)
):
    result = get_project_info(db,project_id)
    return result

# 프로젝트 생성
@router_project.post('/create')
def create_project(
    inbound_data: ProjectManageIn,
    user_id:str = 'songmoana',
    db: Session = Depends(get_db),
):
    insert_project(db,inbound_data, user_id)
    
# 프로젝트 수정
@router_project.post('/update')
def update_project(
    inbound_data:ProjectManageEditDTO,
    project_id:int,
    user_id:str = 'songmoana',
    db:Session = Depends(get_db)
):
    change_project(db,inbound_data,project_id,user_id)

# 프로젝트 삭제    
@router_project.post('/delete')
def delete_project(
    project_id:int,
    user_id:str = 'songmoana',
    db:Session = Depends(get_db)
):
    remove_project(db,project_id,user_id)