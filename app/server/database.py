from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session

# db 추가

DB = {}
engine = create_engine(DB, max_overflow=0, pool_recycle=1000, pool_pre_ping=True, echo = True) 
Base = declarative_base()

def get_db():
    SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=True, bind=engine)) 
    session = SessionLocal()
    try:
        yield session
        session.commit()
        print(' - db commit -')
    except:
        session.rollback()
    finally:
        session.close()
        
