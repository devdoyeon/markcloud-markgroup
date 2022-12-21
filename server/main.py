from fastapi import FastAPI
from router.projectManage import router_project
from router.notice import router_notice
from router.memberManage import router_member

def get_server():
    server = FastAPI(
        title='markcloud-groupware-api', docs_url="/docs", redoc_url=None,
        openapi_url=f'/openapi.json'
    )
        
    server.include_router(router_project)
    server.include_router(router_notice)
    server.include_router(router_member)
    
    return server

app = get_server()