from fastapi import APIRouter, FastAPI

from .environment import measurement, trend
from .websocket import ws_router


def init_router(app: FastAPI):
    router = APIRouter(
        prefix="/api/v1",
    )

    measurement.register_router(router)
    trend.register_router(router)

    app.include_router(router)
    app.include_router(ws_router)
