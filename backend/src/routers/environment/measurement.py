from fastapi import APIRouter

router = APIRouter(prefix="/environment", tags=["measurement"])


@router.get("/measurement")
async def measurement():
    pass


def register_router(api_router: APIRouter):
    api_router.include_router(router)
