from sqlalchemy import Column,BigInteger,VARCHAR,DateTime, Enum,Integer,Boolean
from database  import Base
from datetime import datetime
import enum

class genderEnum(str, enum.Enum):
    male = "male"
    female = "female"

class roleEnum(str, enum.Enum):
    root = "root"
    admin = "admin"
    super_user = "super_user"
    paid_user = "paid_user"
    guest= "guest"


class DepartmentTable(Base):
    __tablename__ = 'groupware_department'
    
    id = Column(BigInteger, nullable = False, primary_key = True, autoincrement= True)
    organ_code = Column(VARCHAR(14), nullable = False)
    department_name = Column(VARCHAR(50), nullable = False)
    created_at = Column(DateTime, default=datetime.today(),nullable = False)
    created_id = Column(BigInteger, nullable = False)
    updated_at = Column(DateTime, default=datetime.today(),nullable = False)
    updated_id = Column(BigInteger, default = created_id, nullable = False)
    
    
class MemberTable(Base):
    __tablename__ = 'members'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(VARCHAR(20), index=True, nullable=False)
    user_id = Column(VARCHAR(30), unique=True, index=True, nullable=False) 
    hashed_password = Column(VARCHAR(255), nullable=False)
    email = Column(VARCHAR(255), nullable=False) 
    birthday = Column(DateTime, nullable=False)
    phone = Column(VARCHAR(30), nullable=False)
    gender = Column(Enum(genderEnum), nullable=False)
    zip_code = Column(VARCHAR(20), default = 0) 
    address = Column(VARCHAR(255),default = 0) 
    department = Column(VARCHAR(50))
    department_code = Column(VARCHAR(14))
    section = Column(VARCHAR(50))
    is_active = Column(Boolean, default=True, nullable=False)
    member_role = Column(Enum(roleEnum), default='guest', nullable=False)
    created_at = Column(DateTime, default=datetime.today(), nullable=False)
    updated_at = Column(DateTime, default=datetime.today(), nullable=False) 
    last_login = Column(DateTime, default=datetime.today(), nullable=False) 
    login_ip = Column(VARCHAR(20), default=0, nullable=False) 
    login_count = Column(Integer,  default=0, nullable=False)
    refresh_token = Column(VARCHAR(255), default=0, nullable=False) 
    unique_key = Column(VARCHAR(255), default = 0,nullable=False)
    use_token = Column(DateTime)
    associated_token = Column(Integer)
    event_in_use = Column(Integer)
    groupware_only_yn = Column(VARCHAR(1), default = 'N')
    
