# 공지사항

from fastapi import APIRouter


router_notice = APIRouter(
    prefix="/notice/",
    tags=['notice api']
)
