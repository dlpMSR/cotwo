from datetime import datetime

from pydantic import BaseModel


class LatestEnvValue(BaseModel):
    temperature: float
    humidity: float
    co2: float


class TrendDatum(BaseModel):
    timestamp: datetime
    value: int | float
