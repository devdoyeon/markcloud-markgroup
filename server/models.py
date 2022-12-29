from sqlalchemy import Column, BIGINT, String, Text, DateTime
from database import Base


class BoardTable(Base):
    __tablename__ = "groupware_board"
    
    id = Column(BIGINT, primary_key=True)               # PRI
    organ_code = Column(String(14), nullable=False)     # MUL
    title = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False)
    created_id = Column(BIGINT, nullable=False)
    updated_at = Column(DateTime, nullable=False)
    updated_id = Column(BIGINT, nullable=False)


class BusinessReportTable(Base):
    __tablename__ = "groupware_business_report"
    
    id = Column(BIGINT, primary_key=True)               # PRI
    organ_code = Column(String(14), nullable=False)     # MUL
    title = Column(String(50), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, nullable=False)
    created_id = Column(BIGINT, nullable=False)
    updated_at = Column(DateTime, nullable=False)
    updated_id = Column(BIGINT, nullable=False)
    
    
class OrganizationTable(Base):
    __tablename__ = "groupware_organization"

    id = Column(BIGINT, primary_key=True)               # PRI
    organ_code = Column(String(14), nullable=False)     # MUL
    organ_name = Column(String(50), nullable=False)
    owner_user_id = Column(String(30), nullable=False)  # MUL
    created_at = Column(DateTime, nullable=False)
    created_id = Column(String(30), nullable=False)
    updated_at = Column(DateTime, nullable=False)
    updated_id = Column(String(30), nullable=False)