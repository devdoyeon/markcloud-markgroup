from model import noticeModel, memberManageModel
from router import author_chk

from sqlalchemy import desc
from fastapi import HTTPException
from datetime import datetime 


def get_notice_list(db, offset, limit, user_info, filter_type, filter_val):
    
    notice_table = noticeModel.NoticeTable
    member_table = memberManageModel.MemberTable

    try:
        query = db.query(notice_table.id,
                        notice_table.created_at,
                        member_table.name.label('created_id'),
                        notice_table.title
                        ).filter(notice_table.organ_code == user_info.department_code
                        ).join(member_table, notice_table.created_id == member_table.id
                        ).order_by(desc(notice_table.id))

        # 필터 O
        if filter_type:    
            if filter_type == 'title':
                query = query.filter(notice_table.title.ilike(f'%{filter_val}%'))

            elif filter_type == 'created_id':
                query = query.filter(member_table.name.ilike(f'%{filter_val}%'))
        
        notice_count = query.count()
        notice_list = query.offset(offset).limit(limit).all()
        
        return notice_count, notice_list
    
    except:
        raise HTTPException(status_code=500, detail='GetNtError')    


def get_notice_info(db, notice_id, user_info):
    
    notice_table = noticeModel.NoticeTable
    member_table = memberManageModel.MemberTable
     
    try:
        
        notice_info = db.query(notice_table.title,notice_table.created_at,
                            notice_table.updated_at, notice_table.content, member_table.name.label('created_id')
                                ).filter(notice_table.id == notice_id
                                ).filter(notice_table.organ_code == user_info.department_code
                                ).join(member_table,notice_table.created_id == member_table.id
                                ).first()
        return notice_info
    except:
        raise HTTPException(status_code=500, detail='GetNtInfoError')

def insert_notice(db,inbound_data,user_info):
    
    notice_table = noticeModel.NoticeTable
    
    try:    
        db_query = notice_table(
            title=inbound_data.title,
            organ_code = user_info.department_code,
            content=inbound_data.content,
            created_id=user_info.id)
        db.add(db_query)
        
    except:
        raise HTTPException(status_code=500, detail='InsertNtError')


def change_notice(db,inbound_data,notice_id, user_info):
    
    notice_table = noticeModel.NoticeTable
    
    try: 
        values = {'title':inbound_data.title,
                'content':inbound_data.content,
                'updated_at':datetime.today()
                }
        
        base_q = db.query(notice_table).filter(notice_table.id == notice_id).first()
        
        if user_info.id == base_q.created_id or user_info.groupware_only_yn == 'N':
            db.query(notice_table).filter_by(id = notice_id).update(values)
        else:
            raise HTTPException(status_code=422, detail='InvalidClient')
    except:
        raise HTTPException(status_code=500, detail='ChangeNtError')
    

def remove_notice(db,notice_id, user_info):

    notice_table = noticeModel.NoticeTable

    try:          
        base_q = db.query(notice_table).filter(notice_table.id == notice_id)
        
        if user_info.id == base_q.first().created_id or user_info.groupware_only_yn == 'N':
            base_q.delete()
        else:
            raise HTTPException(status_code=422, detail='InvalidClient')
    except:
        raise HTTPException(status_code=500, detail='DeleteNtError')
    

