# 업무관리
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import *
from crud.projectManageCrud import *

router_project = APIRouter(
    prefix="/projects",
    tags=["Project Manage API"]
)

@router_project.get('/read')  # 전체 업무현황 # 나의 업무현황, # 내가 요청한 업무 filter 로 걸어야..?
def read_projects( 
    db: Session = Depends(get_db),
):
    pass

@router_project.post('/create')
def create_projects(
    db: Session =Depends(get_db)
):
    return insert_projects(db)

@router_project.post('/update')
def update_projects(
    db: Session =Depends(get_db)
):
    return change_projects(db)
    
@router_project.post('/delete')
def update_projects(
    db: Session =Depends(get_db)
):
    return remove_projects(db)