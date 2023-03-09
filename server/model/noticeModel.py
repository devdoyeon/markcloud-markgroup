from sqlalchemy import Column,BigInteger,VARCHAR,DateTime
from sqlalchemy.dialects.mysql import LONGTEXT 

from database  import Base
from datetime import datetime


class NoticeTable(Base):
    __tablename__ = 'groupware_notice'
    
    id = Column(BigInteger, nullable = False, primary_key=True, autoincrement=True)
    organ_code = Column(VARCHAR(14), nullable = False)
    title = Column(VARCHAR(50), nullable = False)
    content = Column(LONGTEXT, nullable = False)
    created_at = Column(DateTime, nullable = False)
    created_id = Column(BigInteger, nullable = False)
    updated_at = Column(DateTime, nullable = False)
    updated_id = Column(BigInteger, default =created_id, nullable = False)
    img_url = Column(LONGTEXT)