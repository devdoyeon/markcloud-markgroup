from sqlalchemy.orm import Session
from fastapi import HTTPException
from starlette import status

from datetime import datetime

from models import BoardTable
from model.memberManageModel import *

from schema.board_schema import PostCreate, PostUpdate
from router import security

from crud import utils
from crud import customError


def get_post_list(db: Session, 
                  filter_type: str, 
                  filter_val: str, 
                  offset: int, 
                  limit: int, 
                  user_pk: int):
    user_info = security.get_user_info(db, user_pk)
    post_list = db.query(BoardTable.id, 
                            BoardTable.created_at, 
                            MemberTable.name.label('created_id'), 
                            BoardTable.title
                        ).filter(BoardTable.organ_code == user_info.department_code
                        ).join(MemberTable, BoardTable.created_id == MemberTable.id
                        ).order_by(BoardTable.id.desc())
    
    search = f'%%{filter_val}%%'
    if filter_type == "title":
        post_list = post_list.filter(BoardTable.title.ilike(search))
    elif filter_type == "created_id":
        post_list = post_list.filter(MemberTable.name.ilike(search))
    total = post_list.distinct().count()
    print(f"t o t a l :: {total}")
    post_list = post_list.order_by(BoardTable.created_at.desc()).offset(offset).limit(limit).all()
    return total, post_list


def get_post(db: Session, post_id: int, user_info):
    post = db.query(BoardTable.title, 
                    BoardTable.created_at, 
                    BoardTable.updated_at, 
                    BoardTable.content, 
                    MemberTable.name.label('created_id'), 
                    MemberTable.id.label('user_pk'),
                    BoardTable.img_url
                    ).filter(BoardTable.id == post_id
                    ).filter(BoardTable.organ_code == user_info.department_code
                    ).join(MemberTable,BoardTable.created_id == MemberTable.id).first()
    
    return post


def create_post(db: Session, post_create: PostCreate, file, user_info):
    
    if file:
        img_url = utils.get_s3_url(file, 'board')
    else:
        img_url = None
    
    db_post = BoardTable(
        organ_code = user_info.department_code,
        title = post_create.title,
        content = post_create.content,
        created_at = datetime.now(),
        created_id = user_info.id,
        updated_at = datetime.now(),
        img_url = img_url
    )

    db.add(db_post)
    db.flush()

    return img_url


def update_post(
    db: Session,
    post_id: int,
    post_update: PostUpdate,
    file,
    user_info
    ):    
    db_post = db.query(BoardTable).filter(BoardTable.id == post_id).first()
    
    if user_info.id == db_post.created_id or user_info.groupware_only_yn == 'N':
    
        update_values = {
            "title": post_update.title,
            "content": post_update.content,
            "updated_at": datetime.now(),
            "updated_id": user_info.id
        }
            
        if post_update.url and file:
            print("1+1")
            origin_url = ','.join(post_update.url)
            img_url = utils.get_s3_url(file, 'board')
            update_values['img_url'] = origin_url + ',' + img_url
        
        elif post_update.url:
            print("1+0")
            origin_url = ','.join(post_update.url)
            update_values['img_url'] = origin_url
            
        elif file:
            print("0+1")
            img_url = utils.get_s3_url(file, 'board')
            update_values['img_url'] = img_url
            
        result = db.query(BoardTable).filter_by(id = post_id).update(update_values)
        return result 
    
    else:
        raise HTTPException(status_code=422, detail='InvalidClient')



# def delete_post(db: Session, post_id: int, user_pk: int):
def delete_post(db: Session, post_id: int, user_info: str):
    
    # user_info = security.get_user_info(db, user_pk)

    db_post = db.query(BoardTable).filter(BoardTable.id == post_id)    
    
    # if user_pk == db_post.first().created_id or user_info.groupware_only_yn == 'N':
    if user_info.id == db_post.first().created_id or user_info.groupware_only_yn == 'N':
        result = db_post.delete()
        return result
    else:
        raise customError.InvalidError
    
    