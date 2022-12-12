from models import NoticeTable
from schema import noticeSchema

from fastapi import HTTPException



def get_notice_list(db, offset, limit, filter_type, filter_val):
    
    table = NoticeTable
    
    
    query = db.query(table.id,
                    table.created_at,
                    table.created_id,
                    table.title)
    
    try:
        if filter_type:
            if filter_type == 'title':
                query = query.filter(table.title == filter_val)
            elif filter_type == 'created_id':
                query = query.filter(table.created_id == filter_val)
                
        notice_result = query.offset(offset).limit(limit).all()
        
        return notice_result
    
    except:
        raise HTTPException(status_code=500, detail='dbGetError')

def get_notice_info(db,notice_id):
    
    table = NoticeTable    
    try:
        
        notice_info = db.query(table.title,
                               table.created_id,
                               table.created_at,
                               table.updated_at,
                               table.content).filter(table.id == notice_id).first()
        return notice_info
    
    except:
        raise HTTPException(status_code=500, detail='dbGetError')
    



def insert_notice(db,inbound_data):
    
    db_query = NoticeTable(
        title=inbound_data.title,
        content=inbound_data.content,
        organ_code=inbound_data.organ_code,
        created_at=inbound_data.created_at,
        created_id = inbound_data.created_id,
        updated_at = inbound_data.updated_at,
        updated_id = inbound_data.updated_id
    )
    try:
        db.add(db_query)
    except:
        HTTPException(status_code=500, detail='dbInsertError')



def change_notice(db,inbound_data):
    
    table = NoticeTable
    
    values = {table.title:inbound_data.title,
              table.content:inbound_data.content,
              table.updated_at:inbound_data.updated_at
              }
    try:
        db.query(table).filter(table.id == inbound_data.id).update(values)
    except:
        HTTPException(status_code=500, detail='dbUpdateError')
    

def remove_notice(db,notice_id):
    
    table = NoticeTable
    # notice_id 있는지 확인 후 ㄱㄱ
    try:
        db.query(table).filter(table.id == notice_id).delete()
    except:
        HTTPException(status_code=500, detail='dbDeleteError')
    