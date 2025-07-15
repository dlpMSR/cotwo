from fastapi import APIRouter, FastAPI

from .environment import measurement, trend


def init_api_router(app: FastAPI):
    router = APIRouter(
        prefix="/api/v1",
    )

    measurement.register_router(router)
    trend.register_router(router)

    app.include_router(router)
