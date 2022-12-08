from fastapi import FastAPI
from router import router_

def get_server():
    server = FastAPI(
        title='markcloud-groupware-api', docs_url="/docs", redoc_url=None,
        openapi_url=f'openapi.json'
    )
    
    server.include_router(router_business)