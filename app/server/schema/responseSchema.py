# from abc import *
# from typing import Optional, TypeVar
# from pydantic import BaseModel


# T = TypeVar('T')

# # 1 
# class MetaBase(BaseModel):
#     __abstract__ = True
    
#     meta:dict = {}
    
#     def metadata(self,**kwargs):
#         self.meta = {k:v for k, v in kwargs.items()}
#         return self
    
# class Response(MetaBase):
    
#     data:Optional[T] = None
    
#     def successRensponse(self, data:Optional[T] = None):
#         self.data = data
#         return self

from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, TypeVar, Generic, List
from pydantic.generics import GenericModel
from pydantic import BaseModel


T = TypeVar('T')

class MetaBase(BaseModel):
    __abstract__ = True

    meta: dict = {}
    def metadata(self, **kwargs):
        for k, v in kwargs.items():
            self.meta.setdefault(k, v)
        return self

class ResponseBase(MetaBase):
    __abstract__ = True
    
    status: dict = {}
    def SUCCESSFULresponse(self):
        self.status = {
            'code': 200,
            'description' :'Successful Transaction!'
        }
        return self

class Response(ResponseBase, GenericModel, Generic[T]):

    data: Optional[T] = None

    class Config:
        arbitarary_types_allowed = True
    
    def SUCCESSFULresponse(self, data: Optional[T] = None):
        super().SUCCESSFULresponse()
        self.data = data
        return self

