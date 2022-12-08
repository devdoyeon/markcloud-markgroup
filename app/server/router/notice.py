# 공지사항
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import *
from crud.noticeCrud import *
from schema.noticeSchema import *
from typing import List


router_notice = APIRouter(
    prefix="/notice",
    tags=['Notice API']
)


# 전체 공지 확인
@router_notice.get('/read',response_model=List[NoticeOut])
def read_projects( 
    db: Session = Depends(get_db),
):
    return get_notice(db)

# 공지 생성
@router_notice.post('/create')
def create_projects(
    inbound_data: NoticeIn,
    db: Session = Depends(get_db),
):
    return insert_notice(db,inbound_data)
    
# 공지 수정
@router_notice.post('/update')
def update_projects(
    inbound_data : NoticeIn,
    db: Session =Depends(get_db)
):
    return change_notice(db,inbound_data)

# 공지 삭제
@router_notice.post('/delete')
def delete_projects(
    notice_id,
    db: Session =Depends(get_db)
):
    return remove_notice(db,notice_id)