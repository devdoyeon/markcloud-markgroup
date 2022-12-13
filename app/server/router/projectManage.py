# 업무관리
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional

from database import *
from crud.projectManageCrud import *



from database import *
from crud.noticeCrud import *
from schema.projectManageSchema import *
from schema.responseSchema import *
from typing import List



router_project = APIRouter(
    prefix="/projects",
    tags=["Project Manage API"]
)

@router_project.get('/list', response_model = Response[List[ProjectManageOut]])
def read_project_list(
    filter_type: Optional[ProjectManageFilter] = None,
    page: int = 1,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    print("Here")
    offset = (page - 1) * limit
    
    project_list = get_project_list(db, offset, limit, filter_type)
    total_count = len(project_list)
    total_page = total_count // limit
    
    if total_page % limit != 0:
        total_page += 1
    
    return Response().metadata(
        page=page,
        totalPage=total_page,
        offset=offset,
        limit=limit
    ).success_response(project_list)
