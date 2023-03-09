from sqlalchemy import Column, BigInteger, VARCHAR, DateTime, Enum, TEXT
import enum
from database import Base
   
    
class IntellectualPropertyTable(Base):
    __tablename__ = "groupware_ip"
    
    id = Column(BigInteger, nullable=False, primary_key=True, autoincrement=True)
    organ_code = Column(VARCHAR(14), nullable=False)
    rights = Column(VARCHAR(10), nullable=False)
    application_date = Column(DateTime, nullable=False)
    application_number = Column(VARCHAR(20), nullable=False)
    applicant = Column(VARCHAR(10), nullable=False)
    status = Column(VARCHAR(20), nullable=False)
    name_kor = Column(TEXT, nullable=False)
    name_eng = Column(TEXT, nullable=False)
    product_code = Column(VARCHAR(10), nullable=False)
    registration_date = Column(DateTime, nullable=False)
    registration_number = Column(VARCHAR(20), nullable=False)

    