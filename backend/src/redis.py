import os
from pathlib import Path

import redis
import redis.asyncio as aioredis
from dotenv import load_dotenv

from src.websocket import ConnectionManager

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

REDIS_HOST = os.environ.get("REDIS_HOST")
REDIS_PORT = os.environ.get("REDIS_PORT")

pool = redis.ConnectionPool(host=REDIS_HOST, port=REDIS_PORT)
redis_client = redis.Redis(connection_pool=pool, decode_responses=True)

aioredis_client = aioredis.Redis(
    host=REDIS_HOST, port=REDIS_PORT, decode_responses=True
)


async def redis_listener(manager: ConnectionManager):
    pubsub = aioredis_client.pubsub()
    await pubsub.subscribe("cotwo:env_value_broadcast")
    async for message in pubsub.listen():
        if message["type"] == "message":
            await manager.broadcast(message["data"])
