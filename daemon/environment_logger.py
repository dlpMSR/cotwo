#!/usr/bin/env python3

import json
import os
import random
import statistics
import time
from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone

import MySQLdb
import redis
from dotenv import load_dotenv

load_dotenv()


@dataclass
class Measurement:
    temperature: float
    humidity: float
    co2: int
    timestamp: datetime


class SensorRepository(ABC):
    @abstractmethod
    def is_sensor_ready(self) -> bool:
        pass

    @abstractmethod
    def get_measurement(self) -> Measurement:
        pass


class Scd4xSensorRepository(SensorRepository):
    def __init__(self):
        import adafruit_scd4x
        import board

        self.i2c = board.I2C()
        self.scd4x = adafruit_scd4x.SCD4X(self.i2c)
        print("Serial number:", [hex(i) for i in self.scd4x.serial_number])

        self.scd4x.start_low_periodic_measurement()

    def is_sensor_ready(self) -> bool:
        return self.scd4x.data_ready

    def get_measurement(self) -> Measurement:
        return Measurement(
            temperature=round(self.scd4x.temperature, 1),
            humidity=round(self.scd4x.relative_humidity, 1),
            co2=self.scd4x.CO2,  # 疑惑
            timestamp=datetime.now(timezone.utc),
        )


class MockSensorRepository(SensorRepository):
    def is_sensor_ready(self) -> bool:
        return True

    def get_measurement(self) -> Measurement:
        return Measurement(
            temperature=round(random.uniform(0, 50), 1),
            humidity=round(random.uniform(0, 100), 1),
            co2=int(random.uniform(400, 1500)),
            timestamp=datetime.now(timezone.utc),
        )


def _mysql_connection():
    DB_HOST = os.getenv("DB_HOST")
    DB_PORT = int(os.getenv("DB_PORT"))
    DB_NAME = os.getenv("DB_NAME")
    DB_USER = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")

    return MySQLdb.connect(
        host=DB_HOST, port=DB_PORT, user=DB_USER, passwd=DB_PASSWORD, db=DB_NAME
    )


def _set_redis_client():
    REDIS_HOST = os.getenv("REDIS_HOST")
    REDIS_PORT = int(os.getenv("REDIS_PORT"))
    return redis.Redis(host=REDIS_HOST, port=REDIS_PORT)


if __name__ == "__main__":
    sensor_repo: SensorRepository = MockSensorRepository()
    # sensor_repo: SensorRepository = Scd4xSensorRepository()

    while True:
        if sensor_repo.is_sensor_ready():
            measurement = sensor_repo.get_measurement()
            print(measurement)

            # MySQLに環境値を記録
            sql = """
                INSERT INTO `env_value` (`temperature`, `humidity`, `co2`, `created_at`)
                VALUES (%s, %s, %s, %s)
            """
            with _mysql_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        sql,
                        (
                            measurement.temperature,
                            measurement.humidity,
                            measurement.co2,
                            measurement.timestamp,
                        ),
                    )
                conn.commit()

            # 過去30分の計測状況を確認
            thirty_mins_ago = datetime.now(timezone.utc) - timedelta(minutes=30)
            sql = """
                SELECT `co2` FROM `env_value` WHERE `created_at` > %s ORDER BY `created_at` DESC LIMIT 100;
            """
            with _mysql_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(sql, (thirty_mins_ago.strftime("%Y-%m-%dT%H:%M:%SZ"),))
                    co2_thirty_mins = [item[0] for item in cur.fetchall()]

            print(len(co2_thirty_mins))
            if len(co2_thirty_mins) > 25:
                # 補正値をキャッシュに保存
                # TODO: Redisに保存・配信する環境値の形式を見直す
                api_value = {
                    "temperature": measurement.temperature,
                    "humidity": measurement.humidity,
                    "co2": round(statistics.mean(co2_thirty_mins), 1),
                    "timestamp": measurement.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                }

                ws_value = {
                    "type": "env_data",
                    "message": {
                        "temperature": measurement.temperature,
                        "humidity": measurement.humidity,
                        "co2": int(measurement.co2),
                        "co2_corrected": round(statistics.mean(co2_thirty_mins), 1),
                        "timestamp": measurement.timestamp.strftime(
                            "%Y-%m-%d %H:%M:%S"
                        ),
                    },
                }

                conn = _set_redis_client()
                conn.set("scd41:measurement", json.dumps(api_value), ex=90)
                conn.publish("cotwo:env_value_broadcast", json.dumps(ws_value))

        time.sleep(60)
