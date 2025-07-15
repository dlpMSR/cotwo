from datetime import datetime, timedelta

from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy import desc

from src.database import Session
from src.models.env_value import EnvValue

router = APIRouter(prefix="/environment/trend", tags=["trend"])


class TrendDatum(BaseModel):
    timestamp: datetime
    value: int | float


@router.get("/co2", response_model=list[TrendDatum])
async def trend_co2():
    with Session() as session:
        twelve_hours_ago = datetime.now() - timedelta(hours=12)
        query = (
            session.query(EnvValue.created_at, EnvValue.co2)
            .filter(EnvValue.created_at > twelve_hours_ago)
            .order_by(desc(EnvValue.created_at))
        )

        result = query.all()

    return [TrendDatum(timestamp=timestamp, value=value) for timestamp, value in result]


@router.get("/temperature", response_model=list[TrendDatum])
async def trend_temperature():
    with Session() as session:
        twelve_hours_ago = datetime.now() - timedelta(hours=12)
        query = (
            session.query(EnvValue.created_at, EnvValue.temperature)
            .filter(EnvValue.created_at > twelve_hours_ago)
            .order_by(desc(EnvValue.created_at))
        )

        result = query.all()

    return [TrendDatum(timestamp=timestamp, value=value) for timestamp, value in result]


@router.get("/humidity", response_model=list[TrendDatum])
async def trend_humidity():
    with Session() as session:
        twelve_hours_ago = datetime.now() - timedelta(hours=12)
        query = (
            session.query(EnvValue.created_at, EnvValue.humidity)
            .filter(EnvValue.created_at > twelve_hours_ago)
            .order_by(desc(EnvValue.created_at))
        )

        result = query.all()

    return [TrendDatum(timestamp=timestamp, value=value) for timestamp, value in result]


def register_router(api_router: APIRouter):
    api_router.include_router(router)
