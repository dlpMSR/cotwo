from fastapi import APIRouter

router = APIRouter(prefix="/environment/trend", tags=["trend"])


@router.get("/co2")
async def trend_co2():
    pass


@router.get("/temperature")
async def trend_temperature():
    pass


@router.get("/humidity")
async def trend_humidity():
    pass


def register_router(api_router: APIRouter):
    api_router.include_router(router)
