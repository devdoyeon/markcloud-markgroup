from functools import wraps
from fastapi import HTTPException
from dotenv import load_dotenv
import jwt
import os
from model import memberManageModel
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") 


load_dotenv()

SECRET_KEY = os.environ['SECRET_KEY']
SECURITY_ALGORITHM = os.environ['SECURITY_ALGORITHM']

def varify_access_token(f):
    @wraps(f)
    def decode(*args, **kwargs):
        access_token = kwargs['access_token']
        try:
            access_payload = jwt.decode(access_token,SECRET_KEY, algorithms=SECURITY_ALGORITHM)
            kwargs['user_pk'] = access_payload['user_pk']

        # 토큰만료
        except jwt.ExpiredSignatureError:
            # access_token 만료 에러 raise
            print('AccessTokenExpired')
            raise HTTPException(status_code=403, detail='AccessTokenExpired')
        
        # 그 외 토큰 관련 오류
        except (jwt.DecodeError, jwt.InvalidTokenError):
            print('jwt.DecodeError, jwt.InvalidTokenError')
            raise HTTPException(status_code=499, detail="Invalid Token Format")

        except Exception as e:
            print('access token error', e)
            raise HTTPException(status_code=499, detail='Invalid Token Format')
        return f(*args, **kwargs)
    return decode

# def get_user_info(db, user_pk):
#     member_table = memberManageModel.MemberTable
#     try: 
#         return db.query(member_table).filter(member_table.id == user_pk).first()
#     except:
#         HTTPException(status_code=500, detail='DBError')
        
def user_chk(f):
    @wraps(f)
    def get_user_info(*args, **kwargs):

        user_pk = kwargs['user_pk']
        db = kwargs['db']
        member_table = memberManageModel.MemberTable
        
        try:
            kwargs['user_info'] = db.query(member_table).filter(member_table.id == user_pk).first()
        except:
            raise HTTPException(status_code=422, detail="Invalid User")
        
        return f(*args, **kwargs)
    return get_user_info
        
def get_hashed_password(password: str):
    return pwd_context.hash(password)
