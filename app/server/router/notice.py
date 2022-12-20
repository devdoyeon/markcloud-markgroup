# 공지사항
from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from fastapi.security import APIKeyHeader
from typing import List

from database import *
from crud.noticeCrud import *
from schema.noticeSchema import *
from schema.responseSchema import *
from router import author_chk

router_notice = APIRouter(
    prefix="/notice",
    tags=['Notice API']
)

# 공지 리스트
@router_notice.get('/list', response_model= Response[List[NoticeOut]])
# @author_chk.varify_access_token
def read_notice_list(
    access_token: str = Header(None),
    user_pk:int = 100,
    filter_type: Optional[NoticeFilter] = 'all',
    filter_val: Optional[str] = None,
    page: int = 1,
    limit: int = 9,
    db: Session = Depends(get_db)
):
    
    offset = (page - 1) * limit
    
    total_count, notice_list = get_notice_list(db, offset, limit, user_pk, filter_type, filter_val)
    total_page = total_count // limit 
    
    if total_count % limit != 0:
        total_page += 1
        
    return Response().metadata(
        page=page,
        totalPage=total_page,
        offset=offset,
        limit=limit
    ).success_response(notice_list)


# 공지 상세페이지
# @author_chk.varify_access_token
@router_notice.get('/info',response_model = NoticeInfo)
def read_notice_info(
    notice_id :int,
    access_token:str = Header(None),
    user_pk:int = 100,
    db: Session = Depends(get_db)
):
    notice_info =  get_notice_info(db, notice_id)
    return notice_info

# 공지 생성
# @author_chk.varify_access_token
@router_notice.post('/create')
def create_notice(
    inbound_data: NoticeIn,
    access_token:str = Header(None),
    user_pk:int = 100,
    db: Session = Depends(get_db),
):
    insert_notice(db,inbound_data, user_pk)
    
# 공지 수정
# @author_chk.varify_access_token
@router_notice.post('/update') # 관리자와 작성자 아이디를 받아와야함 created_id 와 같을 경우 삭제 가능하도록
def update_notice(
    inbound_data: NoticeEditDTO,
    notice_id:int,
    access_token:str = Header(None),
    user_pk:int = None,
    db: Session = Depends(get_db)
):
    return change_notice(db,inbound_data,notice_id,user_pk)

# 공지 삭제
# @author_chk.varify_access_token
@router_notice.post('/delete') # 관리자와 작성자 아이디를 받아와야함 created_id 와 같을 경우 삭제 가능하도록
def delete_notice(
    notice_id:int,
    user_pk:int = None,
    access_token:str = Header(None),
    db: Session = Depends(get_db)
):
    return remove_notice(db,notice_id,user_pk)