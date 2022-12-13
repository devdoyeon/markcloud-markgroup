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

class Response(MetaBase,GenericModel, Generic[T]):

    data: Optional[T] = None 

    def success_response(self, data: Optional[T] = None):
        self.data = data
        return {'data':self.data, 'meta':self.meta}

