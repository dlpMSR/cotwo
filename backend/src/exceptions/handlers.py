from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from src.exceptions.custom_exceptions import LatestMeasurementUnavailableException


def init_exception_handler(app: FastAPI):
    @app.exception_handler(LatestMeasurementUnavailableException)
    async def latest_measurement_unavailabele_exception_handler(
        request: Request, exc: LatestMeasurementUnavailableException
    ):
        return JSONResponse(status_code=503, content={"detail": exc.message})
