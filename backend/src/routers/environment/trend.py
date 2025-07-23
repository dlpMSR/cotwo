from fastapi import APIRouter, Depends

from src.repositories.env_value_repository import EnvValueRepository
from src.repositories.mariadb.env_value_repository_impl import EnvValueRepositoryImpl
from src.schemas.responses.env_value_response_shema import TrendDatum
from src.usecases.env_value_usecase import EnvValueUsecase

router = APIRouter(prefix="/environment/trend", tags=["trend"])


# DI関数
def get_env_value_repository():
    return EnvValueRepositoryImpl()


def get_env_value_usecase(
    env_value_repository: EnvValueRepository = Depends(get_env_value_repository),
):
    return EnvValueUsecase(env_value_repository=env_value_repository)


@router.get("/temperature", response_model=list[TrendDatum])
async def trend_temperature(usecase=Depends(get_env_value_usecase)):
    result = usecase.get_last_12_hours_records()
    return [
        TrendDatum(
            timestamp=record.timestamp,
            value=record.temperature,
        )
        for record in result
    ]


@router.get("/humidity", response_model=list[TrendDatum])
async def trend_humidity(usecase=Depends(get_env_value_usecase)):
    result = usecase.get_last_12_hours_records()
    return [
        TrendDatum(
            timestamp=record.timestamp,
            value=record.humidity,
        )
        for record in result
    ]


@router.get("/co2", response_model=list[TrendDatum])
async def trend_co2(usecase=Depends(get_env_value_usecase)):
    result = usecase.get_last_12_hours_records()
    return [
        TrendDatum(
            timestamp=record.timestamp,
            value=record.co2,
        )
        for record in result
    ]


def register_router(api_router: APIRouter):
    api_router.include_router(router)
