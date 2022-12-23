from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional
from enum import Enum
from starlette import status

from database import get_db
from schema.base_schema import Response, filterType
from schema.board_schema import Board, PostOut, BoardOut, PostCreate, PostUpdate
from crud import board_crud
from router import author_chk
import utils

import time


router = APIRouter(prefix="/board")


# user_id -> current_user: User = Depends(get_current_user) 로 변경 예정.


@router.get("/list", response_model=Response[List[BoardOut]])
@author_chk.varify_access_token
def post_list(
    access_token: str = Header(None),
    user_pk:int = None,
    filter_type: Optional[filterType] = "all", 
    filter_val: Optional[str] = None,
    # user_id: str = "mxxvii", # 로그인한 사용자의 아이디. # user_id -> current_user로 변경예정
    page: int = 1,
    limit: int = 5,
    db:Session = Depends(get_db)
):
    
    print("u s e r  p k :: ", user_pk)
    
    offset = (page - 1) * limit
    total, _post_list = board_crud.get_post_list(db, filter_type, filter_val, offset, limit, user_pk)
    # total, _post_list = board_crud.get_post_list(db, filter_type, filter_val, offset, limit, user_id)
    totalPage = total // limit
    if total % limit != 0:
        totalPage += 1
    
    return Response().metadata(
        page=page,
        totalPage=totalPage,
        offset=offset,
        limit=limit
    ).success_response(_post_list)


@router.get("/detail", response_model=PostOut)
def post_detail(post_id: int, db: Session = Depends(get_db)):
    post = board_crud.get_post(db, post_id)
    return post


@router.post("/create")
@author_chk.varify_access_token
def post_create(_post_create: PostCreate, 
                # user_id: str = "mxxvii",
                access_token:str = Header(None),
                user_pk: int = None,  
                db: Session = Depends(get_db)):
    # board_crud.create_post(db, user_id, _post_create)
    board_crud.create_post(db, user_pk, _post_create)
    

@router.post("/update")
@author_chk.varify_access_token
def post_update(
    post_id: int, 
    _post_update: PostUpdate, 
    access_token:str = Header(None),
    user_pk:int = None,
    db: Session = Depends(get_db)): # user_id -> current_user로 변경예정
    
    _db_post = board_crud.get_post(db, post_id)
    
    if not _db_post:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="데이터를 찾을 수 없습니다.")
    
    user_info = author_chk.get_user_info(db, user_pk)
    
    # # 현재 로그인한 아이디가 대표계정이면 -> 수정 가능
    # # 현재 로그인한 아이디가 작성자이면 -> 수정 가능
    # 대표계정(members 테이블의 groupware_only_yn 칼럼의 값이 ‘Y’가 아닌 사용자)
    if (user_info.user_id != _db_post.created_id) and (user_info.groupware_only_yn != 'Y'): #### 질문: 
        raise HTTPException(status_code=422, detail='InvalidClient')

    board_crud.update_post(db, _db_post, _post_update, user_pk)


@router.post("/delete")
@author_chk.varify_access_token
def post_delete(
    post_id: int,
    user_pk:int = None,
    access_token:str = Header(None),
    db: Session = Depends(get_db)
    ):
    
    _db_post = board_crud.get_post(db, post_id)
    
    if not _db_post:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="데이터를 찾을 수 없습니다.")
        
    # owner_id = utils.get_owner_id(db, user_id)
    
    # if (user_id != _db_post.created_id) and (user_id != owner_id):
    #     raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
    #                         detail="삭제 권한이 없습니다.")
    
    user_info = author_chk.get_user_info(db, user_pk)
    
    # # 현재 로그인한 아이디가 대표계정이면 -> 수정 가능
    # # 현재 로그인한 아이디가 작성자이면 -> 수정 가능
    # 대표계정(members 테이블의 groupware_only_yn 칼럼의 값이 ‘Y’가 아닌 사용자)
    if (user_info.user_id != _db_post.created_id) and (user_info.groupware_only_yn != 'Y'): #### 질문: 
        raise HTTPException(status_code=422, detail='InvalidClient')
    
    board_crud.delete_post(db, _db_post)
    