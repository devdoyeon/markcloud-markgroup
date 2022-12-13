# 업무 관리
from model.projectManageModel import * 
from fastapi import HTTPException

# 관리자와 작성자 따로 가야 합니 다. 정 확 히 이 해 했.ㅇ.

def get_project_list(db, offset, limit, filter_type):
    
    table = ProjectManageTable
    
    query = db.query(table)
    
    try:
        # 필터 O
        if filter_type:
            if filter_type == 'all': # 전체 확인
                query = query
            # elif filter_type == 'MyProject': # 나의 업무
            #     query = query.filter()
            # elif filter_type == 'MR':
            #     query = query.filter(table.created_id.ilike(f'%{filter_val}%'))
                
                
        # 필터 X        
        project_list = query.offset(offset).limit(limit).all()
        print(project_list)
        return project_list
    except:
        raise HTTPException(status_code=500, detail='DBError')