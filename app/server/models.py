from sqlalchemy import Column,BigInteger,VARCHAR,DateTime, TEXT
from datetime import datetime
import enum

from database  import Base


class NoticeTable(Base):
    __tablename__ = 'groupware_notice'
    
    id = Column(BigInteger, nullable = False, primary_key=True, autoincrement=True)
    organ_code = Column(VARCHAR(14), nullable = False)
    title = Column(VARCHAR(50), nullable = False)
    content = Column(TEXT, nullable = False)
    created_at = Column(DateTime, nullable = False)
    created_id = Column(VARCHAR(30), nullable = False)
    updated_at = Column(DateTime, nullable = False)
    updated_id = Column(VARCHAR(30), nullable = False)
