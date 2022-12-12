# 공지사항
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import *
from crud.noticeCrud import *
from schema.noticeSchema import *
from schema.responseSchema import *
from typing import List, Dict

router_notice = APIRouter(
    prefix="/notice",
    tags=['Notice API']
)

# 전체 공지 확인
@router_notice.get('/list', response_model= Response[List[NoticeOut]])
def read_notice_list(
    filter_type: Optional[NoticeFilter] = None,
    filter_val: Optional[str] = None, 
    page: int = 1,
    limit: int = 9,
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit
    
    notice_list = get_notice_list(db, offset, limit, filter_type, filter_val)
    total_count = len(notice_list)
    total_page = total_count // limit 
    
    if total_count % limit != 0:
        total_page += 1

    result = Response().metadata(
        page=page,
        totalPage=total_page,
        offset=offset,
        limit=limit
    ).SUCCESSFULresponse(notice_list)

    return {'data':result.data, 'status':result.status, 'meta': result.meta}


# 공지 내용 
@router_notice.get('/info',response_model = NoticeInfo)
def read_notice_info(
    notice_id :int,
    db: Session = Depends(get_db)
):
    notice_info =  get_notice_info(db, notice_id)
    return notice_info


# 공지 생성
@router_notice.post('/create')
def create_notice(
    inbound_data: NoticeIn,
    db: Session = Depends(get_db),
):
    return insert_notice(db,inbound_data)
    
# 공지 수정
@router_notice.post('/update')
def update_notice(
    inbound_data : NoticeIn,
    db: Session = Depends(get_db)
):
    return change_notice(db,inbound_data)

# 공지 삭제
@router_notice.post('/delete')
def delete_notice(
    notice_id,
    db: Session = Depends(get_db)
):
    return remove_notice(db,notice_id)