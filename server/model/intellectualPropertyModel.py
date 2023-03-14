from sqlalchemy import Column, BigInteger, VARCHAR, DateTime, Enum, TEXT
import enum
from database import Base
   
    
class IntellectualPropertyTable(Base):
    __tablename__ = "groupware_ip"
    
    id = Column(BigInteger, nullable=False, primary_key=True, autoincrement=True)
    organ_code = Column(VARCHAR(14), nullable=False)
    rights = Column(VARCHAR(10), nullable=False)
    application_date = Column(DateTime, nullable=True)
    application_number = Column(VARCHAR(20), nullable=True)
    applicant = Column(VARCHAR(10), nullable=True)
    ip_status = Column(VARCHAR(20), nullable=True)
    name_kor = Column(TEXT, nullable=True)
    name_eng = Column(TEXT, nullable=True)
    product_code = Column(VARCHAR(10), nullable=True)
    registration_date = Column(DateTime, nullable=True)
    registration_number = Column(VARCHAR(20), nullable=True)
    created_at = Column(DateTime, nullable=False)
    created_id = Column(BigInteger, nullable=False)
    updated_at = Column(DateTime, nullable=True)
    updated_id = Column(BigInteger, nullable=True)