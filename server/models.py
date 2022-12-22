from sqlalchemy import Column, BIGINT, String, Text, DateTime, Date, Enum, Boolean, Integer
from enum import Enum
from sqlalchemy.dialects.mysql import ENUM
from database import Base


class BoardTable(Base):
    __tablename__ = "groupware_board"
    
    id = Column(BIGINT, primary_key=True)               # PRI
    organ_code = Column(String(14), nullable=False)     # MUL
    title = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False)
    created_id = Column(String(30), nullable=False)
    updated_at = Column(DateTime, nullable=False)
    updated_id = Column(String(30), nullable=False)


class BusinessReportTable(Base):
    __tablename__ = "groupware_business_report"
    
    id = Column(BIGINT, primary_key=True)               # PRI
    organ_code = Column(String(14), nullable=False)     # MUL
    title = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False)
    created_id = Column(String(30), nullable=False)
    updated_at = Column(DateTime, nullable=False)
    updated_id = Column(String(30), nullable=False)
    
    
# class ProjectTable(Base):
#     __tablename__ = "groupware_project"
    
#     id = Column(BIGINT, primary_key=True)               # PRI
#     organ_code = Column(String(14), nullable=False)     # MUL
#     project_code = Column(String(14), nullable=False)   # UNI
#     project_name = Column(String(50), nullable=False)
#     project_description = Column(String(200))
#     project_start_date = Column(DateTime, nullable=False)
#     project_end_date = Column(DateTime, nullable=False)
#     project_status = Column(String(10), nullable=False)
#     created_at = Column(DateTime, nullable=False)
#     created_id = Column(String(30), nullable=False)
#     updated_at = Column(DateTime, nullable=False)
#     updated_id = Column(String(30), nullable=False)
    

# class ProjectMembersTable(Base):
#     __tablename__ = "groupware_project_members"

#     id = Column(BIGINT, primary_key=True)               # PRI
#     project_code = Column(String(14), nullable=False)   # MUL
#     user_id = Column(String(30), nullable=False)        # MUL
#     created_at = Column(DateTime, nullable=False)
#     created_id = Column(String(30), nullable=False)
#     updated_at = Column(DateTime, nullable=False)
#     updated_id = Column(String(30), nullable=False)
    
    
    
# class MemberTable(Base):
#     __tablename__ = "members"
    
#     id = Column(BIGINT, primary_key=True)               # PRI
#     name = Column(String(20), nullable=False)           # MUL
#     user_id = Column(String(30), nullable=False)        # UNI
#     hashed_password = Column(String(255), nullable=False)
#     email = Column(String(255), nullable=False)
#     birthday = Column(Date, nullable=False)
#     phone = Column(String(30), nullable=False)
#     gender = Column(ENUM('male', 'female'), nullable=False) #### Enum ???
#     zip_code = Column(String(20), nullable=False)
#     address = Column(String(255), nullable=False)
#     department = Column(String(50))
#     department_code = Column(String(14))
#     section = Column(String(50))
#     is_active = Column(Boolean, nullable=False)         #### tinyint ???
#     member_role = Column(ENUM('root', 'admin', 'paid_user', 'guest'), nullable=False) #### Enum ???
#     created_at = Column(DateTime, nullable=False)
#     updated_at = Column(DateTime, nullable=False)
#     last_login = Column(DateTime, nullable=False)
#     login_ip = Column(String(20), nullable=False)
#     login_count = Column(Integer, nullable=False)       #### int(11) ???
#     refresh_token = Column(String(255), nullable=False)
#     unique_key = Column(String(255), nullable=False)
#     use_token = Column(DateTime)
#     associated_token = Column(Integer)       #### int(11) ???
#     event_in_use = Column(Integer)       #### int(11) ???
#     groupware_only_yn = Column(String(1), default="N")    #### default???
    
    
class OrganizationTable(Base):
    __tablename__ = "groupware_organization"

    id = Column(BIGINT, primary_key=True)               # PRI   #### bigint(20) ??
    organ_code = Column(String(14), nullable=False)     # MUL
    organ_name = Column(String(50), nullable=False)
    owner_user_id = Column(String(30), nullable=False)  # MUL
    created_at = Column(DateTime, nullable=False)
    created_id = Column(String(30), nullable=False)
    updated_at = Column(DateTime, nullable=False)
    updated_id = Column(String(30), nullable=False)