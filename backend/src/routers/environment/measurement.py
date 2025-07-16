import json

from fastapi import APIRouter

from src.redis import redis_client
from src.schemas.responses.env_value_response_shema import LatestEnvValue

router = APIRouter(prefix="/environment", tags=["measurement"])


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
