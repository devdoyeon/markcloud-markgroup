# 업무관리
from fastapi import APIRouter, Depends,Header, HTTPException, UploadFile
from sqlalchemy.orm import Session
from typing import Optional,List


from database import *
from crud.projectManageCrud import *
from schema.projectManageSchema import *
from schema.responseSchema import *
from router import security

router_project = APIRouter(
    prefix="/projects",
    tags=["Project Manage API"]
)

# 프로젝트 관련 데이터
@router_project.post('/read',response_model = Response[List[ProjectManageOut]])
@security.varify_access_token
@security.user_chk
def read_projects(
    access_token: str = Header(None),
    inbound_filter: Optional[ProjectManageFilter] = None,
    user_pk: int = None,
    user_info:str = None,
    status_filter : Optional[ProjectManageStatusFilter] = 'MyProject',
    page: int = 1,
    limit: int = 10,
    db:Session = Depends(get_db)
):
    # 관리자 확인
    if status_filter.value == 'All':
        if user_info.groupware_only_yn == 'Y':
            raise HTTPException(status_code=422, detail = 'NotAdmin')
        
    try:
        offset = (page - 1) * limit
        total_count, project_list = get_project_list(db, offset, limit, user_info, status_filter, inbound_filter) # 업무현황 데이터
        total_page = total_count // limit

        if total_count % limit != 0:
            total_page += 1
            
        all_project_name = get_project_name(db,user_info) # 전체 프로젝트명 
        project_member = get_project_member(db,user_info, inbound_filter) # 요청자 & 담당자

        return Response().metadata(
            project_name = all_project_name,
            project_member = project_member,
            total_count = total_count,
            page=page,
            totalPage=total_page,
            offset=offset,
            limit=limit
        ).success_response(project_list)
        
    except:
        raise HTTPException(status_code=500, detail='ReadPjtError')

# 프로젝트 상세페이지
@router_project.get('/info', response_model = ProjectManageOut)
@security.varify_access_token
@security.user_chk
def read_project_info(
    project_id:int,
    access_token:str = Header(None),
    user_pk:int = None,
    user_info:str = None,
    db: Session = Depends(get_db)
):
    try:
        
        project_info = get_project_info(db,project_id,user_info)
        
        if project_info.img_url:
            new_img_url = project_info.img_url
            img_url = new_img_url.split(',')
            
        else:
            img_url = None 
        
        outbound = ProjectManageOut(
                    id = project_info.id,
                    title = project_info.title,
                    content = project_info.content,
                    project_name = project_info.project_name,
                    request_id = project_info.request_id,
                    manager_id = project_info.manager_id,
                    work_status = project_info.work_status,
                    created_at = project_info.created_at,
                    created_id = project_info.created_id,
                    work_end_date = project_info.work_end_date,
                    img_url = img_url)

        return outbound
    
    except:
        raise HTTPException(status_code=500, detail='ReadPjtInfoError')
    
# 프로젝트 생성
@router_project.post('/create')
@security.varify_access_token
@security.user_chk
def create_project(
    file: Union[List[UploadFile],None] = None,
    inbound_data: ProjectManageIn = Depends(),
    access_token: str = Header(None),
    user_pk:int = None,
    user_info:str = None,
    db: Session = Depends(get_db),
):
    try:
        data = insert_project(db,inbound_data, file, user_info)
        return Response().success_response(data)
    
    except:
        raise HTTPException(status_code=500, detail='CreatePjtError')
    
# 프로젝트 수정
@router_project.post('/update')
@security.varify_access_token
@security.user_chk
def update_project(
    project_id:int,
    file: Union[List[UploadFile],None] = None,
    inbound_data:ProjectManageEditDTO = Depends(),
    access_token: str = Header(None),
    user_pk:int = None,
    user_info:str = None,
    db:Session = Depends(get_db)
):
    try:
        data = change_project(db,inbound_data,project_id)
        return Response().success_response(data)
    
    except:
        raise HTTPException(status_code=500, detail='UpdatePjtError')
    
# 프로젝트 삭제    
@router_project.post('/delete')
@security.varify_access_token
@security.user_chk
def delete_project(
    project_id:int,
    access_token: str = Header(None),
    user_pk:int = None,
    user_info:str = None,
    db:Session = Depends(get_db)
):
    try:
        data = remove_project(db,project_id,user_info)
        return Response().success_response(data)
    
    except customError.InvalidError:
        raise HTTPException(status_code=422, detail='InvalidClient')
    except:
        raise HTTPException(status_code=500, detail='DeletePjtError')