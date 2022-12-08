# 인사관리
from fastapi import APIRouter


router_personnel = APIRouter(
    prefix="/personnel",
    tags=['personnel manage api']
)
