from fastapi import FastAPI

from router.projectManage import router_project
from router.notice import router_notice
from router.memberManage import router_member

from router import board_router, business_report_router, project_router, ip_router

from database import engine, Base
Base.metadata.create_all(bind=engine)

def get_server():
    server = FastAPI(
        title='markcloud-groupware-api', docs_url="/docs", redoc_url=None,
        openapi_url=f'/openapi.json'
    )
        
    server.include_router(router_project)
    server.include_router(router_notice)
    server.include_router(router_member)
    
    server.include_router(board_router.router, tags=["Board API"])
    server.include_router(business_report_router.router, tags=["Business Report API"])
    server.include_router(project_router.router, tags=["Project API"])
    server.include_router(ip_router.router, tags=["IP Manage API"])
    
    return server

app = get_server()