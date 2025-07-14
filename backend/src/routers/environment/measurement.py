import json

from fastapi import APIRouter
from pydantic import BaseModel

from src.redis import redis_client

router = APIRouter(prefix="/environment", tags=["measurement"])


class LatestEnvValue(BaseModel):
    temperature: float
    humidity: float
    co2: float


@router.get("/measurement")
async def measurement():
    try:
        measurement = await redis_client.get("scd41:measurement")
    except Exception as e:
        print(e)
        raise

    if measurement:
        values = json.loads(measurement)
        return LatestEnvValue(
            temperature=values["temperature"],
            humidity=values["humidity"],
            co2=values["humidity"],
        )


def register_router(api_router: APIRouter):
    api_router.include_router(router)
