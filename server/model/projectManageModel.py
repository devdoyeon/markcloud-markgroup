from sqlalchemy import Column,BigInteger,VARCHAR,DateTime, TEXT
from sqlalchemy.dialects.mysql import LONGTEXT
from database import Base


class ProjectManageTable(Base):
    __tablename__ = "groupware_work_management"
    
    id = Column(BigInteger, nullable =False, primary_key = True, autoincrement = True)
    organ_code = Column(VARCHAR(14), nullable =False)
    project_code = Column(VARCHAR(14), nullable =False, unique = True)
    title = Column(VARCHAR(50), nullable = False)
    request_id = Column(VARCHAR(30), nullable = False)
    manager_id = Column(VARCHAR(30), nullable = False)
    content = Column(LONGTEXT, nullable = True)
    work_status = Column(VARCHAR(10), nullable = False)
    work_end_date = Column(DateTime, nullable = True)
    created_at = Column(DateTime, nullable = False)  
    created_id = Column(BigInteger, nullable = False)
    updated_at = Column(DateTime, nullable = False) 
    updated_id = Column(BigInteger, default=created_id, nullable = False)
    img_url = Column(LONGTEXT)

class ProjectTable(Base):
    __tablename__ = "groupware_project"
    
    id = Column(BigInteger, nullable =False, primary_key = True, autoincrement = True)
    organ_code = Column(VARCHAR(14), nullable =False)
    project_code = Column(VARCHAR(14), nullable =False, unique = True)
    project_name = Column(VARCHAR(50), nullable = False)
    project_description = Column(TEXT, nullable = False)
    project_start_date = Column(DateTime, nullable = False)
    project_end_date = Column(DateTime, nullable = False)
    project_status = Column(VARCHAR(10), nullable = False)
    created_at = Column(DateTime, nullable = False)
    created_id = Column(BigInteger, nullable = False)
    updated_at = Column(DateTime, default=created_at, nullable = False)
    updated_id = Column(BigInteger, default=created_id, nullable = False)
    img_url = Column(LONGTEXT)

    
class ProjectMemberTable(Base):
    __tablename__ = "groupware_project_members"
    
    id = Column(BigInteger, nullable = False, primary_key = True, autoincrement = True)
    project_code = Column(VARCHAR(14),nullable = False)
    user_id = Column(VARCHAR(14),nullable = False)
    created_at = Column(DateTime, nullable = False)
    created_id = Column(BigInteger, nullable = False)
    updated_at = Column(DateTime, nullable = False)
    updated_id = Column(BigInteger, nullable = False)
    