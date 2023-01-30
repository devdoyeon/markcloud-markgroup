from fastapi import APIRouter, Depends, HTTPException, Header, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional, Union

from database import get_db
from schema.base_schema import Response, filterType
from schema.board_schema import PostOut, BoardOut, PostCreate, PostUpdate
from crud import board_crud
from router import security

from crud import customError


router = APIRouter(prefix="/board")

@router.get("/list", response_model=Response[List[BoardOut]])
@security.varify_access_token
@security.user_chk
def post_list(
    access_token: str = Header(None),
    user_pk:int = None,
    user_info: str = None,
    filter_type: Optional[filterType] = "all", 
    filter_val: Optional[str] = None,
    page: int = 1,
    limit: int = 9,
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
@security.varify_access_token
@security.user_chk
def post_detail(
    post_id: int, 
    access_token:str = Header(None),
    user_pk:int = None,
    user_info:str = None, 
    db: Session = Depends(get_db)):
    try:
        post = board_crud.get_post(db, post_id, user_info)
        
        if post.img_url:
            new_img_url = post.img_url
            img_url = new_img_url.split(',')
        else:
            img_url = None
        
        outbound = PostOut(
            title = post.title,
            created_id = post.created_id,
            created_at = post.created_at,
            updated_at = post.updated_at,
            content = post.content,
            user_pk = user_pk,
            img_url = img_url
        )
        return outbound
        # return post
    except:
        raise HTTPException(status_code=500, detail='PostDetailError')


@router.post("/create")
@security.varify_access_token
@security.user_chk
def post_create(
    file: Union[List[UploadFile], None] = None,
    _post_create: PostCreate = Depends(), 
    access_token:str = Header(None),
    user_info: str = None,
    user_pk: int = None,  
    db: Session = Depends(get_db)
):    
    try:
        # data = board_crud.create_post(db, user_pk, _post_create)
        data = board_crud.create_post(db, _post_create, file, user_info)
        return Response().success_response(data)
    
    except customError.S3ConnError:
        raise HTTPException(status_code=505, detail='S3ConnError')
    except:
        raise HTTPException(status_code=500, detail='PostCreateError')
    

@router.post("/update")
@security.varify_access_token
@security.user_chk
def post_update(
    post_id: int, 
    file: Union[List[UploadFile], None] = None,
    _post_update: PostUpdate = Depends(),
    access_token:str = Header(None),
    user_info: str = None,
    user_pk:int = None,
    db: Session = Depends(get_db)
):
    try:
        data = board_crud.update_post(db, post_id, _post_update, file, user_info)
        print(data)
        return Response().success_response(data)
    except customError.InvalidError:
        raise HTTPException(status_code=422, detail='InvalidClient')
    except customError.S3ConnError:
        raise HTTPException(status_code=505, detail='S3ConnError')
    except:
        raise HTTPException(status_code=500, detail='PostUpdateError')
    

@router.post("/delete")
@security.varify_access_token
@security.user_chk
def post_delete(
    post_id: int,
    user_pk:int = None,
    user_info: str = None,
    access_token:str = Header(None),
    db: Session = Depends(get_db)
    ):    
    try:
        # board_crud.delete_post(db, post_id, user_pk)
        data = board_crud.delete_post(db, post_id, user_info)
        return Response().success_response(data)
    except customError.InvalidError:
        raise HTTPException(status_code=422, detail='InvalidClient')
    except:
        raise HTTPException(status_code=500, detail='PostDeleteError')