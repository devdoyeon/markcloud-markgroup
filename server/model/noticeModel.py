from sqlalchemy import Column,BigInteger,VARCHAR,DateTime, TEXT

from database  import Base
from datetime import datetime


class NoticeTable(Base):
    __tablename__ = 'groupware_notice'
    
    id = Column(BigInteger, nullable = False, primary_key=True, autoincrement=True)
    organ_code = Column(VARCHAR(14), nullable = False)
    title = Column(VARCHAR(50), nullable = False)
    content = Column(TEXT, nullable = False)
    created_at = Column(DateTime, default=datetime.today(), nullable = False)
    created_id = Column(VARCHAR(30), nullable = False)
    updated_at = Column(DateTime, default=datetime.today(), nullable = False)
    updated_id = Column(VARCHAR(30), default =created_id, nullable = False)