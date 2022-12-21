from fastapi import FastAPI

from . import models
from server.database import engine
from server.router import board_router
from server.router import business_report_router
from server.router import project_router

app = FastAPI()

app.include_router(board_router.router, tags=["Board API"])
app.include_router(business_report_router.router, tags=["Business Report API"])
app.include_router(project_router.router, tags=["Project API"])