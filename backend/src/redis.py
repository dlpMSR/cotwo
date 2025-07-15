import json
import os
from pathlib import Path

import redis.asyncio as redis
from dotenv import load_dotenv

from src.websocket import ConnectionManager

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

REDIS_HOST = os.environ.get("REDIS_HOST")
REDIS_PORT = os.environ.get("REDIS_PORT")

redis_client = redis.Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    decode_responses=True,
)


async def redis_listener(manager: ConnectionManager):
    pubsub = redis_client.pubsub()
    await pubsub.subscribe("cotwo:env_value_broadcast")

    async for message in pubsub.listen():
        print(message)
        if message["type"] == "message":
            data: str = message["data"]
            await manager.broadcast(data)
