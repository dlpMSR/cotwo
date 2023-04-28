#!/usr/bin/env python3

import time
import json
import os
import random
import redis
import statistics
import datetime
# import board
# import adafruit_scd4x
import MySQLdb
from dotenv import load_dotenv
from pytz import timezone
from django.conf import settings
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync


def _mysql_connection():
    load_dotenv()
    DB_HOST = os.getenv('DB_HOST')
    DB_PORT = int(os.getenv('DB_PORT'))
    DB_NAME = os.getenv('DB_NAME')
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')

    connection = MySQLdb.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        passwd=DB_PASSWORD,
        db=DB_NAME
    )

    return connection

def _set_redis_client():
    load_dotenv()
    REDIS_HOST = os.getenv('REDIS_HOST')
    REDIS_PORT = int(os.getenv('REDIS_PORT'))

    redis_pool = redis.ConnectionPool(host=REDIS_HOST, port=REDIS_PORT, db=0, max_connections=4)
    conn = redis.StrictRedis(connection_pool=redis_pool)

    return conn

def _set_channel_layers():
    load_dotenv()
    REDIS_HOST = os.getenv('REDIS_HOST')
    REDIS_PORT = int(os.getenv('REDIS_PORT'))

    settings.configure(
    CHANNEL_LAYERS={
        "default": {
            "BACKEND": "channels_redis.core.RedisChannelLayer",
            "CONFIG": {
                "hosts": [(REDIS_HOST, REDIS_PORT)],
            },
        }
    }
)


if __name__ == '__main__':
    # i2c = board.I2C()
    # scd4x = adafruit_scd4x.SCD4X(i2c)
    # print("Serial number:", [hex(i) for i in scd4x.serial_number])

    _set_channel_layers()
    channel_layer = get_channel_layer()

    #scd4x.start_periodic_measurement()
    #print("Waiting for first measurement....")

    while True:
        if True:
            measurement = (
                "%0.1f" % random.uniform(0, 50),        # temp
                "%0.1f" % random.uniform(0, 100),       # humidity
                "%d" % int(random.uniform(400, 1500)),  # co2
                datetime.datetime.now(timezone('UTC')).strftime("%Y-%m-%d %H:%M:%S")    # timestamp
            )
            print(measurement)
            # MySQLに環境値を記録
            sql = """
                INSERT INTO `env_value` (`temperature`, `humidity`, `co2`, `created_at`)
                VALUES (%s, %s, %s, %s)
            """
            with _mysql_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(sql, measurement)
                conn.commit()

            # 過去30分の計測状況を確認
            now_utc = datetime.datetime.now(datetime.timezone.utc)
            thirty_mins_ago = now_utc - datetime.timedelta(minutes=30)
            sql = """
                SELECT `co2` FROM `env_value` WHERE `created_at` > %s ORDER BY `created_at` DESC LIMIT 100;
            """
            with _mysql_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(sql, (thirty_mins_ago.strftime("%Y-%m-%d %H:%M:%S"),))
                    co2_thirty_mins = [item[0] for item in cur.fetchall()]

            print(len(co2_thirty_mins))
            if len(co2_thirty_mins) > 25:
                # 補正値をキャッシュに保存
                correction_value = {
                    'temperature': measurement[0],
                    'humidity': measurement[1],
                    'co2': round(statistics.mean(co2_thirty_mins), 1),
                    'timestamp': measurement[3] 
                }

                conn = _set_redis_client()
                conn.set('measurement', json.dumps(correction_value), ex=90)
                
                # Websocketで補正値を配信
                async_to_sync(channel_layer.group_send)(
                    "realtime_env_ws", {
                        "type": "env_data", "message": {
                            "temperature": correction_value['temperature'],
                            "humidity": correction_value['humidity'],
                            "co2": correction_value['co2']
                        }
                    }
                )

                # TODO: 通知

        time.sleep(60)
