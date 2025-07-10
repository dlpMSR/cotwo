from fastapi import FastAPI
from src.routers import init_router

app = FastAPI()

init_router(app)


@app.get("/")
async def root():
    return {"message": "OK"}
