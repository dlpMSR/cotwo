import typer
from fastapi import FastAPI
from src.commands import init_cli
from src.routers import init_api_router
from src.routers.websocket import setup_websocket_routes, ws_router
from src.websocket import ConnectionManager

app = FastAPI()
cli = typer.Typer()
manager = ConnectionManager()

init_api_router(app)
setup_websocket_routes(manager)
app.include_router(ws_router)


@app.get("/")
async def root():
    return {"message": "OK"}


if __name__ == "__main__":
    init_cli(cli)
    cli()
