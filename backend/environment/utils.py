from pathlib import Path
import environ
import os
import redis

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env()
env.read_env(os.path.join(BASE_DIR, '.env'))

def get_redis_handle():
    REDIS_HOST = env('REDIS_HOST')
    REDIS_PORT = int(env('REDIS_PORT'))
    redis_pool = redis.ConnectionPool(
        host=REDIS_HOST,
        port=REDIS_PORT,
        db=0,
        max_connections=4
    )
    
    return redis.StrictRedis(connection_pool=redis_pool)
