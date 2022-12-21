from pydantic import BaseModel
from typing import Optional, TypeVar, Generic
from pydantic.generics import GenericModel

from enum import Enum


T = TypeVar('T')

class MetaBase(BaseModel):
    __abstract__ = True
    
    meta: dict = {}
    def metadata(self, **kwargs):
        for k, v in kwargs.items():
            self.meta.setdefault(k, v)
        return self
    

class Response(MetaBase, GenericModel, Generic[T]):
    data: Optional[T] = None
    
    def success_response(self, data: Optional[T] = None):
        self.data = data
        return {'data': self.data, 'meta':self.meta}
    
    
class filterType(str, Enum):
    all = "all"
    title = "title"
    created_id = "created_id"