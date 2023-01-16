from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from schema.base_schema import Response, filterType
from schema.board_schema import PostOut, BoardOut, PostCreate, PostUpdate
from crud import board_crud
from router import security


router = APIRouter(prefix="/board")

@router.get("/list", response_model=Response[List[BoardOut]])
@security.varify_access_token
def post_list(
    access_token: str = Header(None),
    user_pk:int = None,
    filter_type: Optional[filterType] = "all", 
    filter_val: Optional[str] = None,
    page: int = 1,
    limit: int = 5,
    db:Session = Depends(get_db)
):
    try:
        offset = (page - 1) * limit
        total, _post_list = board_crud.get_post_list(db, filter_type, filter_val, offset, limit, user_pk)
        totalPage = total // limit
        if total % limit != 0:
            totalPage += 1
        
        return Response().metadata(
            page=page,
            totalPage=totalPage,
            offset=offset,
            limit=limit
        ).success_response(_post_list)
    except:
        raise HTTPException(status_code=500, detail='PostListError')


@router.get("/detail", response_model=PostOut)
def post_detail(post_id: int, db: Session = Depends(get_db)):
    try:
        post = board_crud.get_post(db, post_id)
        return post
    except:
        raise HTTPException(status_code=500, detail='PostDetailError')


@router.post("/create")
@security.varify_access_token
def post_create(_post_create: PostCreate, 
                access_token:str = Header(None),
                user_pk: int = None,  
                db: Session = Depends(get_db)):
    try:
        board_crud.create_post(db, user_pk, _post_create)
    except:
        raise HTTPException(status_code=500, detail='PostCreateError')
    

@router.post("/update")
@security.varify_access_token
def post_update(
    post_id: int, 
    _post_update: PostUpdate, 
    access_token:str = Header(None),
    user_pk:int = None,
    db: Session = Depends(get_db)):
    try:
        board_crud.update_post(db, _post_update, post_id, user_pk)
    except:
        raise HTTPException(status_code=500, detail='PostUpdateError')
    

@router.post("/delete")
@security.varify_access_token
def post_delete(
    post_id: int,
    user_pk:int = None,
    access_token:str = Header(None),
    db: Session = Depends(get_db)
    ):    
    try:
        board_crud.delete_post(db, post_id, user_pk)
    except:
        raise HTTPException(status_code=500, detail='PostDeleteError')