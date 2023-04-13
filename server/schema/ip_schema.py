from pydantic import BaseModel
from datetime import date
from enum import Enum
from typing import Optional


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
    
    
class IPListIn(BaseModel):
    rights: Optional[rightsEnum]
    application_number: Optional[str]
    application_start_date: Optional[date]
    application_end_date: Optional[date]
    applicant: Optional[str]
    name_kor: Optional[str]
    product_code: Optional[str]
    registration_number: Optional[str]
    registration_start_date: Optional[date]
    registration_end_date: Optional[date]
    
    class Config:
        orm_mode = True


class IPListOut(BaseModel):
    id: str
    rights: Optional[str]
    application_date: Optional[date]
    application_number: Optional[str]
    applicant: Optional[str]
    ip_status: Optional[str]
    name_kor: Optional[str]
    product_code: Optional[str]
    registration_date: Optional[date]
    registration_number: Optional[str]
    
    class Config:
        orm_mode = True
        
        
class IPOut(BaseModel):
    # id: str
    rights: Optional[str]
    application_date: Optional[date]
    application_number: Optional[str]
    applicant: Optional[str]
    ip_status: Optional[str]
    name_kor: Optional[str]
    name_eng: Optional[str]
    product_code: Optional[str]
    registration_date: Optional[date]
    registration_number: Optional[str]
    created_id: str
    created_at: date
    user_pk: int
    
    class Config:
        orm_mode = True
        

class IPInput(BaseModel):
    rights: Optional[rightsEnum]
    application_date: Optional[date]
    application_number: Optional[str]
    applicant: Optional[str]
    ip_status: Optional[str]
    name_kor: Optional[str]
    name_eng: Optional[str]
    product_code: Optional[str]
    registration_date: Optional[date]
    registration_number: Optional[str]
    
    class Config:
        orm_mode = True