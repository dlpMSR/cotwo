from fastapi import APIRouter, Depends

from src.repositories.env_value_repository import EnvValueRepository
from src.repositories.redis.env_value_repository_impl import EnvValueRepositoryImpl
from src.schemas.responses.env_value_response_shema import LatestEnvValue
from src.usecases.env_value_usecase import EnvValueUsecase

router = APIRouter(prefix="/environment", tags=["measurement"])


# DI関数
def get_env_value_repository():
    return EnvValueRepositoryImpl()


def get_env_value_usecase(
    env_value_repository: EnvValueRepository = Depends(get_env_value_repository),
):
    return EnvValueUsecase(env_value_repository=env_value_repository)


@router.get("/measurement")
async def measurement(usecase: EnvValueUsecase = Depends(get_env_value_usecase)):
    record = usecase.get_latest_record()

    return LatestEnvValue(
        temperature=record.temperature,
        humidity=record.humidity,
        co2=record.co2,
    )


def register_router(api_router: APIRouter):
    api_router.include_router(router)
