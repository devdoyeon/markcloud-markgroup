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

# 프로젝트 목록
@router_project.get('/list', response_model = Response[List[ProjectManageOut]])
def read_project_list(
    status_filter: Optional[ProjectManageStatusFilter] = 'MyProject',
    # filter: Optional[ProjectManageFilter] = None,
    # progress_filter : Optional[ProgressFilter] = None,
    user_id: str = 'songmoana',
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db)
):

    offset = (page - 1) * limit
    total_count, project_list = get_project_list(db, offset, limit, user_id,status_filter)
    total_page = total_count // limit
    
    if total_page % limit != 0:
        total_page += 1
    
    return Response().metadata(
        page=page,
        totalPage=total_page,
        offset=offset,
        limit=limit
    ).success_response(project_list)


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