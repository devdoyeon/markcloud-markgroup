# 업무관리

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import *

router_project = APIRouter(
    prefix="/projects",
    tags=['project manage api']
)

@router_project.get('/')
def get_projects(
    
    db: Session = Depends(get_db),
):
    pass
    