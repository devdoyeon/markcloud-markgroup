from sqlalchemy.orm import Session
from fastapi import HTTPException
from starlette import status

from datetime import datetime

from models import BoardTable
from model.memberManageModel import *

from schema.board_schema import PostCreate, PostUpdate
from router import author_chk


def get_post_list(db: Session, 
                  filter_type: str, 
                  filter_val: str, 
                  offset: int, 
                  limit: int, 
                  user_pk: int):
    try:  
        user_info = author_chk.get_user_info(db, user_pk)
        post_list = db.query(BoardTable.id, BoardTable.created_at, MemberTable.name.label('created_id'), BoardTable.title) \
            .filter(BoardTable.organ_code == user_info.department_code) \
                .join(MemberTable, BoardTable.created_id == MemberTable.id).order_by(BoardTable.id.desc())
        
        search = f'%%{filter_val}%%'
        if filter_type == "title":
            post_list = post_list.filter(BoardTable.title.ilike(search))
        elif filter_type == "created_id":
            post_list = post_list.filter(MemberTable.name.ilike(search))
        total = post_list.distinct().count()
        print(f"t o t a l :: {total}")
        post_list = post_list.order_by(BoardTable.created_at.desc()).offset(offset).limit(limit).all()
        return total, post_list
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")


def get_post(db: Session, post_id: int):
    try:
        post = db.query(BoardTable.title, BoardTable.created_at, BoardTable.updated_at, BoardTable.content, 
                        MemberTable.name.label('created_id'), MemberTable.id.label('user_pk')) \
            .filter(BoardTable.id == post_id) \
                .join(MemberTable,BoardTable.created_id == MemberTable.id).first()
        
        
        return post
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")


def create_post(db: Session, user_pk: int, post_create: PostCreate):
    try: 
        user_info = author_chk.get_user_info(db, user_pk)
        organ_code = user_info.department_code
        
        db_post = BoardTable(organ_code=organ_code,
                        title=post_create.title,
                        content=post_create.content,
                        created_at=datetime.now(),
                        created_id=user_pk,
                        updated_at=datetime.now(),
                        updated_id=user_pk
                        )
        db.add(db_post)
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")


def update_post(
    db: Session,
    post_update: PostUpdate,
    post_id: int,
    user_pk: int
    ):
    user_info = author_chk.get_user_info(db, user_pk)
    
    update_values = {
        "title": post_update.title,
        "content": post_update.content,
        "updated_at": datetime.now(),
        "updated_id": user_pk
    }
    
    db_post = db.query(BoardTable).filter(BoardTable.id == post_id).first()
    
    print(type(db_post.created_id))
    if user_pk == db_post.created_id or user_info.groupware_only_yn == 'N':
        db.query(BoardTable).filter_by(id = post_id).update(update_values)
    else:
        raise HTTPException(status_code=422, detail='InvalidClient')


def delete_post(db: Session, post_id: int, user_pk: int):
    
    user_info = author_chk.get_user_info(db, user_pk)

    db_post = db.query(BoardTable).filter(BoardTable.id == post_id)    
    
    if user_pk == db_post.first().created_id or user_info.groupware_only_yn == 'N':
        db_post.delete()
    else:
        raise HTTPException(status_code=422, detail='InvalidClient')
    
    