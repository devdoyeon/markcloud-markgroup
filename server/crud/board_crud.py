from sqlalchemy.orm import Session
from fastapi import HTTPException
from starlette import status

from datetime import datetime

from models import BoardTable, OrganizationTable
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
        print("user_info :: ",user_info)
        # print(user_info.__dict__)
        
        query = db.query(BoardTable)
        post_list = query.join(MemberTable, 
                               BoardTable.organ_code == MemberTable.department_code) \
                                   .filter(MemberTable.user_id == user_info.user_id)
        
        # post_list = query.join(MemberTable, 
        #                        BoardTable.organ_code == user_info.department_code)
        
        search = f'%%{filter_val}%%'
        if filter_type == "title":
            post_list = post_list.filter(BoardTable.title.ilike(search))
        elif filter_type == "created_id":
            post_list = post_list.filter(BoardTable.created_id.ilike(search))
        total = post_list.distinct().count()
        print(f"t o t a l :: {total}")
        post_list = post_list.order_by(BoardTable.created_at.desc()).offset(offset).limit(limit).all()
        return total, post_list
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")


def get_post(db: Session, post_id: int):
    try:
        post = db.query(BoardTable).get(post_id)
        return post
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")


# def create_post(db: Session, user_id: str, post_create: PostCreate):
def create_post(db: Session, user_pk: int, post_create: PostCreate):
    try: 
        user_info = author_chk.get_user_info(db, user_pk)
        organ_code = user_info.department_code
        
        db_post = BoardTable(organ_code=organ_code,
                        title=post_create.title,
                        content=post_create.content,
                        created_at=datetime.now(),
                        created_id=user_info.user_id,
                        updated_at=datetime.now(),
                        updated_id=user_info.user_id
                        )
        db.add(db_post)
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")


def update_post(
    db: Session, 
    db_post: BoardTable, 
    post_update: PostUpdate,
    user_pk: int
    ):
    user_info = author_chk.get_user_info(db, user_pk)
    db_post.title = post_update.title
    db_post.content = post_update.content
    db_post.updated_at = datetime.now()
    db_post.updated_id = user_info.user_id
    db.add(db_post)
    
     
def delete_post(db: Session, db_post: BoardTable):
    db.delete(db_post)
