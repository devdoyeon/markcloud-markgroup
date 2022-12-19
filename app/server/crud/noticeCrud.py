from model import noticeModel, memberManageModel
from router import author_chk

from sqlalchemy import desc
from fastapi import HTTPException
from datetime import datetime 


def get_notice_list(db, offset, limit, user_pk,filter_type, filter_val):

    try:
        # 유저 정보 확인
        user_info = author_chk.get_user_info(db, user_pk)
        
        sql = f'''
        SELECT a.id, a.created_at, b.name as created_id, a.title
        FROM groupware_notice as a
        INNER JOIN members as b 
        ON a.created_id = b.id
        WHERE a.organ_code = "{user_info.department_code}"'''        
        
        # 필터 O
        if filter_type:    
            if filter_type == 'title':
                sql = sql + f'AND a.title LIKE "%{filter_val}%"'
            elif filter_type == 'created_id':
                sql = sql + f'AND b.name LIKE "%{filter_val}%"'
        # 정렬
        sql = sql + f' ORDER BY a.id DESC LIMIT {limit} OFFSET {offset} '
        # 필터 X
        notice_list = db.execute(sql).fetchall()
        notice_count = len(notice_list) # 캐시처리       
        # return notice_count, notice_list
        return notice_count, notice_list
    
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail='DBError')    


def get_notice_info(db, notice_id):
    
    notice_table = noticeModel.NoticeTable
     
    try:
        notice_info = db.query(notice_table).filter(notice_table.id == notice_id).first()
        return notice_info
    except:
        raise HTTPException(status_code=500, detail='DBError')

def insert_notice(db,inbound_data, user_pk):
    
    notice_table = noticeModel.NoticeTable
    
    try:    
        user_info =author_chk.get_user_info(db,user_pk)
        
        db_query = notice_table(
            title=inbound_data.title,
            organ_code = user_info.department_code,
            content=inbound_data.content,
            created_id=user_pk)
        db.add(db_query)

    except:
        raise HTTPException(status_code=500, detail='DBError')


def change_notice(db,inbound_data,notice_id, user_id):
    
    notice_table = noticeModel.NoticeTable
    
    try: 
        values = {'title':inbound_data.title,
                'content':inbound_data.content,
                'created_id':user_id,
                'updated_at':datetime.today()
                }
        
        base_q = db.query(notice_table).filter(notice_table.id == notice_id).first()
        
        if user_id == base_q.created_id:
            
            db.query(notice_table).filter_by(id = notice_id).update(values)
        else:
            raise HTTPException(status_code=422, detail='InvalidClient')
    except:
        raise HTTPException(status_code=500, detail='DBError')
    

def remove_notice(db,notice_id, user_id):

    notice_table = noticeModel.NoticeTable

    base_q = db.query(notice_table).filter(notice_table.id == notice_id)
    try:  
        if base_q.first().created_id == user_id:
            base_q.delete()
        else:
            raise HTTPException(status_code=422, detail='InvalidClient')
    except:
        raise HTTPException(status_code=500, detail='dbDeleteError')
    

