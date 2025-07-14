import typer
from fastapi import FastAPI
from src.commands import init_cli
from src.routers import init_router

app = FastAPI()
cli = typer.Typer()

init_router(app)


@app.get("/")
async def root():
    return {"message": "OK"}


if __name__ == "__main__":
    init_cli(cli)
    cli()
