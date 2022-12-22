from sqlalchemy.orm import Session
from fastapi import HTTPException
from starlette import status

from datetime import datetime

from server.models import BoardTable, MemberTable, OrganizationTable
from server.schema.board_schema import PostCreate, PostUpdate

member_table = MemberTable
organization_table = OrganizationTable



def get_post_list(db: Session, 
                  filter_type: str, 
                  filter_val: str, 
                  offset: int, 
                  limit: int, 
                  user_id: str):
    
    try:  
        # user_id의 회사 코드 가져오기 (본인 회사의 글만 db에서 가져와야 함)
        
        # #
        # sql = db.query(member_table.department_code).filter(member_table.user_id == user_id)
        # organ_code = db.execute(sql).all()
        # organ_code = [i for i, in organ_code]
        # post_list = db.query(BoardTable).filter(BoardTable.organ_code==organ_code)
        # #
        
        ##
        # member = db.query(MemberTable).filter(MemberTable.user_id == user_id).first()
        # post_list = db.query(BoardTable).filter(BoardTable.organ_code == member.department_code)
        # print(" m e m b e r ", member)
        # ##
        
        
        # ### join 쓰는 코드로 변경하기 (추후에)
        # post_list_2 = db.query(BoardTable).join(MemberTable).filter(MemberTable.user_id == user_id)
        query = db.query(BoardTable)
        post_list = query.join(MemberTable, BoardTable.organ_code == MemberTable.department_code).filter(MemberTable.user_id == user_id)
        
        
        search = f'%%{filter_val}%%'
        if filter_type == "title":
            post_list = post_list.filter(BoardTable.title.ilike(search))
        elif filter_type == "created_id":
            post_list = post_list.filter(BoardTable.created_id.ilike(search))
        total = post_list.distinct().count()
        print(f"t o t a l :: {total}")
        print(post_list)
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

def create_post(db: Session, user_id: str, post_create: PostCreate):
    try:  
        # user_id의 회사 코드 가져오기 (본인 회사의 글만 db에서 가져와야 함)
        sql = db.query(member_table.department_code).filter(member_table.user_id == user_id)
        organ_code = db.execute(sql).all()
        organ_code = [i for i, in organ_code]
        
        db_post = BoardTable(organ_code=organ_code,
                        title=post_create.title,
                        content=post_create.content,
                        created_at=datetime.now(),
                        created_id=user_id,
                        updated_at=datetime.now(),
                        updated_id=user_id
                        )
        db.add(db_post)
        db.commit()
        
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")


def update_post(db: Session, db_post: BoardTable, post_update: PostUpdate, user_id: str):     # current_user로 고치기
    try:
        db_post.title = post_update.title
        db_post.content = post_update.content
        db_post.updated_at = datetime.now()
        db_post.updated_id = user_id     # current_user로 고치기
        db.add(db_post)
        db.commit()
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")
    
     
def delete_post(db: Session, db_post: BoardTable):
    try:    
        db.delete(db_post)
        db.commit()
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="DB ERROR")
