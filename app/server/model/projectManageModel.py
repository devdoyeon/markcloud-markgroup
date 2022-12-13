from sqlalchemy import Column,BigInteger,VARCHAR,DateTime, TEXT
from database import Base

# class ProjectTable:
    
#     __table__ = "groupware_project"
    
#     id = Column(BigInteger, nullable =False, primary_key = True, autoincrement = True)
#     organ_code = Column(VARCHAR(14), nullable =False)
#     project_code = Column(VARCHAR(14), nullable =False, unique = True)
#     project_name = Column(VARCHAR(50), nullable = False)
#     project_description = Column(VARCHAR(200), nullable = True)
#     project_start_date = Column(DateTime, nullable = False)
#     project_end_date = Column(DateTime, nullable = False)
#     project_status = Column(VARCHAR(10), nullable = False)
#     delete_yn = Column(VARCHAR(1), nullable = False, default = "N")
#     created_at = Column(DateTime, nullable = False)
#     created_id = Column(VARCHAR(30), nullable = False)
#     updated_at = Column(DateTime, nullable = False)
#     updated_id = Column(VARCHAR(30), nullable = False)

class ProjectManageTable:
    __table__ = "groupware_work_management"
    
    id = Column(BigInteger, nullable =False, primary_key = True, autoincrement = True)
    organ_code = Column(VARCHAR(14), nullable =False)
    project_code = Column(VARCHAR(14), nullable =False, unique = True)
    title = Column(VARCHAR(50), nullable = False)
    request_id = Column(VARCHAR(30), nullable = False)
    manager_id = Column(VARCHAR(30), nullable = False)
    content = Column(TEXT, nullable = True)
    work_status = Column(VARCHAR(10), nullable = False)
    work_end_date = Column(DateTime, nullable = False)
    created_at = Column(DateTime, nullable = False)  
    created_id = Column(VARCHAR(30), nullable = False)
    updated_at = Column(DateTime, nullable = False)
    updated_id = Column(VARCHAR(30), nullable = False)
    