# 공지사항
from fastapi import APIRouter, Depends, Header, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from typing import List, Union, Optional


from database import *
from crud.noticeCrud import *
from schema.noticeSchema import *
from schema.responseSchema import * 
from router import security

router_notice = APIRouter(
    prefix="/notice",
    tags=['Notice API']
)

# 공지 리스트
@router_notice.get('/list', response_model= Response[List[NoticeOut]])
@security.varify_access_token
@security.user_chk
def read_notice_list(
    access_token: str = Header(None),
    user_pk:int = None,
    user_info:str = None,
    filter_type: Optional[NoticeFilter] = 'all',
    filter_val: Optional[str] = None,
    page: int = 1,
    limit: int = 9,
    db: Session = Depends(get_db)
):
    try:
        offset = (page - 1) * limit
        
        total_count, notice_list = get_notice_list(db, offset, limit, user_info, filter_type, filter_val)
        total_page = total_count // limit 
        
        if total_count % limit != 0:
            total_page += 1
            
        return Response().metadata(
            page=page,
            totalPage=total_page,
            offset=offset,
            limit=limit
        ).success_response(notice_list)
    except:
        raise HTTPException(status_code=500, detail='ReadNtError')

# 공지 상세페이지
@router_notice.get('/info',response_model = NoticeInfo)
# @router_notice.get('/info')
@security.varify_access_token
@security.user_chk
def read_notice_info(
    notice_id :int,
    access_token:str = Header(None),
    user_pk:int = None,
    user_info:str = None, 
    db: Session = Depends(get_db)
):
    try:
        notice_info =  get_notice_info(db,notice_id, user_info)
        
        new_img_url = notice_info.img_url
        img_url = new_img_url.split(',')
        
        outbound = NoticeInfo(
                title = notice_info.title,
                created_id = notice_info.created_id,
                created_at = notice_info.created_at,
                updated_at = notice_info.updated_at,
                content = notice_info.content,
                img_url = img_url
        )
        return outbound
    
    except:
        raise HTTPException(status_code=500, detail='ReadNtInfoError')

# 공지 생성
@router_notice.post('/create')
@security.varify_access_token
@security.user_chk
def create_notice(
    inbound_data: NoticeIn = Depends(),
    # inbound_data: NoticeIn,
    access_token:str = Header(None),
    user_info:str = None,
    file: Union[List[UploadFile],None] = None,
    user_pk:int = None,
    db: Session = Depends(get_db),
):
    try:
        data = insert_notice(db,inbound_data,file,user_info)
        return Response().success_response(data)
    
    except customError.S3ConnError:
        raise HTTPException(status_code=505, detail='S3ConnError')
    
    except Exception: 
        raise HTTPException(status_code=500, detail='CreateNtError')
    
        
# 공지 수정
@router_notice.post('/update') 
@security.varify_access_token
@security.user_chk
def update_notice(
    notice_id:int,
    inbound_data: NoticeEditDTO = Depends(),
    access_token:str = Header(None),
    file: Union[List[UploadFile],None] = None,
    user_pk:int = None,
    user_info:str = None,
    db: Session = Depends(get_db)
):
    try:
        data = change_notice(db,inbound_data,file,notice_id,user_info)
        return Response().success_response(data)
        
    except customError.InvalidError:
        raise HTTPException(status_code=422, detail = 'InvalidClient')    
    except customError.S3ConnError:
        raise HTTPException(status_code=505, detail = 'S3ConnError')
    except:
        raise HTTPException(status_code=500, detail='UpdateNtError')
    
# 공지 삭제
@router_notice.post('/delete')
@security.varify_access_token
@security.user_chk
def delete_notice(
    notice_id:int,
    user_pk:int = None,
    user_info:str = None,
    access_token:str = Header(None),
    db: Session = Depends(get_db)
):
    try:
        data = remove_notice(db,notice_id,user_info)
        return Response().success_response(data)
    
    except customError.InvalidError:
        raise HTTPException(status_code=422, detail='InvalidClient')
    except:
        raise HTTPException(status_code=500, detail='DeleteNtError')
