#!/usr/bin/env python3
import os
import time
from datetime import datetime

import MySQLdb
from dotenv import load_dotenv


def main():
    co2 = 984
    temperature = 26.2
    humidity = 21.4
    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    sql = """
        INSERT INTO `env_value` (`temperature`, `humidity`, `co2`, `created_at`)
        VALUES (%s, %s, %s, %s)
    """

    conn = _mysql_connection()
    with conn:
        with conn.cursor() as cur:
            cur.execute(sql, (temperature, humidity, co2, created_at))
        conn.commit()

    return 0


def _read_sensor_values():
    # dummy
    co2 = 984
    temperature = 26.2
    humidity = 21.4

    return {
        'temperature': temperature,
        'humidity': humidity,
        'co2': co2
    }

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


if __name__ == '__main__':
    main()
