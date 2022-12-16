from sqlalchemy import Column,BigInteger,VARCHAR,DateTime, TEXT
from database import Base
from datetime import datetime

class ProjectManageTable(Base):
    __tablename__ = "groupware_work_management"
    
    id = Column(BigInteger, nullable =False, primary_key = True, autoincrement = True)
    organ_code = Column(VARCHAR(14), nullable =False)
    project_code = Column(VARCHAR(14), nullable =False, unique = True)
    title = Column(VARCHAR(50), nullable = False)
    request_id = Column(VARCHAR(30), nullable = False)
    manager_id = Column(VARCHAR(30), nullable = False)
    content = Column(TEXT, nullable = True)
    work_status = Column(VARCHAR(10), nullable = False)
    work_end_date = Column(DateTime, nullable = True)
    created_at = Column(DateTime,default=datetime.today(), nullable = False)  
    created_id = Column(VARCHAR(30), nullable = False)
    updated_at = Column(DateTime,default=datetime.today(), nullable = False) 
    updated_id = Column(VARCHAR(30), default=created_id, nullable = False)

class ProjectTable(Base):
    __tablename__ = "groupware_project"
    
    id = Column(BigInteger, nullable =False, primary_key = True, autoincrement = True)
    organ_code = Column(VARCHAR(14), nullable =False)
    project_code = Column(VARCHAR(14), nullable =False, unique = True)
    project_name = Column(VARCHAR(50), nullable = False)
    project_description = Column(VARCHAR(200), nullable = False)
    project_start_date = Column(DateTime, nullable = False)
    project_end_date = Column(DateTime, nullable = False)
    project_status = Column(VARCHAR(10), nullable = False)
    delete_yn = Column(VARCHAR(1), default = 'N',nullable = False)  
    created_at = Column(DateTime, nullable = False)
    created_id = Column(VARCHAR(30), nullable = False)
    updated_at = Column(DateTime, nullable = False)
    updated_id = Column(VARCHAR(30), nullable = False)
    
class ProjectMemberTable(Base):
    __tablename__ = "groupware_project_members"
    
    id = Column(BigInteger, nullable = False, primary_key = True, autoincrement = True)
    project_code = Column(VARCHAR(14),nullable = False)
    user_id = Column(VARCHAR(14),nullable = False)
    delete_yn= Column(VARCHAR(1),default = 'N',nullable = False)
    created_at = Column(DateTime, nullable = False)
    created_id = Column(VARCHAR(30), nullable = False)
    updated_at = Column(DateTime, nullable = False)
    updated_id = Column(VARCHAR(30), nullable = False)
    