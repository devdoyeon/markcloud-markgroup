from models import NoticeTable
from fastapi import HTTPException

def get_notice(db):
    
    table = NoticeTable
    
    try: 
        result = db.query(table).all()
        return result
    except:
        raise HTTPException(status_code=500, detail='dbGetError')


def insert_notice(db,inbound_data):
    
    db_query = NoticeTable(
        title=inbound_data.title,
        content=inbound_data.content,
        company=inbound_data.company,
        created_at=inbound_data.created_at,
        created_id = inbound_data.created_id,
        updated_at = inbound_data.updated_at
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
    