from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
import os
from fastapi import HTTPException

from dotenv import load_dotenv

load_dotenv()

# db 추가
db = {
    "user":os.environ['MYSQL_USER'],
    "password":os.environ['MYSQL_PASSWORD'],
    "host":os.environ['DB_HOST'],
    "port":os.environ['DB_PORT'],
    "database":os.environ['MYSQL_DATABASE']
}

DB_URL = f"mysql+pymysql://{db['user']}:{db['password']}@{db['host']}:{db['port']}/{db['database']}?charset=utf8"
engine = create_engine(DB_URL, max_overflow=0, pool_recycle=1000, pool_pre_ping=True) 
Base = declarative_base()

def get_db():
    SessionLocal = sessionmaker(autocommit=False, autoflush=True, bind=engine)
    session = SessionLocal()
    try:
        yield session
        session.commit()
        print(' - db commit - ')
    except Exception as e:
        print(f'Unexpected exception: {e.__class__.__name__}')
        print(f'Detail: {e}')
        session.rollback()
        print(' - db rollback - ')
    finally:
        session.close()

