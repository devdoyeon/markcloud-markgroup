from model import noticeModel, memberManageModel
from sqlalchemy.orm import join
from fastapi import HTTPException
from datetime import datetime 

def get_notice_list(db, offset, limit, user_id,filter_type, filter_val):
    
    notice_table = noticeModel.NoticeTable
    member_table = memberManageModel.MemberTable
    
    # 기업코드 확인
    user_organ_code = db.query(member_table.department_code).filter(member_table.user_id==user_id)
    query = db.query(notice_table).filter(notice_table.organ_code == user_organ_code)
    
    try:
        # 필터 O
        if filter_type:    
            if filter_type == 'title':
                query = query.filter(notice_table.title.ilike(f'%{filter_val}%'))
            elif filter_type == 'created_id':
                query = query.filter(notice_table.created_id.ilike(f'%{filter_val}%'))
                
        # 필터 X
        notice_count = query.count()       
        notice_list = query.offset(offset).limit(limit).all()
        return notice_count, notice_list
    except:
        raise HTTPException(status_code=500, detail='DBError')    


def get_notice_info(db,notice_id):
    
    table = noticeModel.NoticeTable    
    
    try:
        notice_info = db.query(table).filter(table.id == notice_id).first()
        return notice_info
    except:
        raise HTTPException(status_code=500, detail='DBError')

def insert_notice(db,inbound_data, user_id):
    
    table_notice = noticeModel.NoticeTable
    table_member = memberManageModel.MemberTable

    organ_code = db.query(table_member.department_code).filter(table_member.user_id == user_id).first()
    print(organ_code)
    
    db_query = table_notice(
        title=inbound_data.title,
        organ_code = organ_code[0],
        content=inbound_data.content,
        created_id=user_id)
    
    try:
        db.add(db_query)
        print("here")
    except:
        raise HTTPException(status_code=500, detail='DBError')


def change_notice(db,inbound_data,notice_id, user_id):
    
    table = noticeModel.NoticeTable
    
    values = {'title':inbound_data.title,
              'content':inbound_data.content,
              'updated_id':user_id,
              'updated_at':datetime.today()
              }
    
    base_q = db.query(table).filter(table.id == notice_id).first()

    try:
        if user_id == base_q.created_id:
            db.query(table).filter_by(id = notice_id).update(values)
            
        else:
            raise HTTPException(status_code=422, detail='InvalidClient')
    except:
        raise HTTPException(status_code=500, detail='DBError')
    

def remove_notice(db,notice_id, user_id):

    table = noticeModel.NoticeTable

    base_q = db.query(table).filter(table.id == notice_id)
    try:
        if base_q.first().created_id == user_id:
            base_q.delete()
        else:
            raise HTTPException(status_code=422, detail='InvalidClient')
    except:
        HTTPException(status_code=500, detail='dbDeleteError')
    