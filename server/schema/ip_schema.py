from pydantic import BaseModel
from datetime import date
from enum import Enum


class rightsEnum(str, Enum):
    all = "all"
    patent = "patent"   # 특허
    design = "design"   # 디자인
    mark = "mark"     # 상표

class legalStatusEnum(str, Enum):
    all = "all"
    application = "application" # 출원
    decide = "decide"     # 심사중
    opinionNotice = "opinionNotice"  # 의견제출통지
    apply = "apply"   # 등록
    
    
class IPListOut(BaseModel):
    id: str
    rights: str
    application_date: date
    application_number: str
    applicant: str
    status: str
    name_kor: str
    # name_eng: str
    product_code: str
    registration_date: date
    registration_number: str
    
    class Config:
        orm_mode = True
        
        
class IPOut(BaseModel):
    # id: str
    rights: str
    application_date: date
    application_number: str
    applicant: str
    status: str
    name_kor: str
    name_eng: str
    product_code: str
    registration_date: date
    registration_number: str
    created_id: str
    created_at: date
    user_pk: int
    
    class Config:
        orm_mode = True


class IPCreate(BaseModel):
    rights: str
    application_date: date
    application_number: str
    applicant: str
    status: str
    name_kor: str
    name_eng: str
    product_code: str
    registration_date: date
    registration_number: str
    
    class Config:
        orm_mode = True
        

class IPUpdate(BaseModel):
    rights: str
    application_date: date
    application_number: str
    applicant: str
    status: str
    name_kor: str
    name_eng: str
    product_code: str
    registration_date: date
    registration_number: str
    
    class Config:
        orm_mode = True