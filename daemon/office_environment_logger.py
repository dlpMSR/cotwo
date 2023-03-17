#!/usr/bin/env python3

import time
import os
import board
import adafruit_scd4x
import MySQLdb
from dotenv import load_dotenv
from datetime import datetime
from pytz import timezone


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
    i2c = board.I2C()
    scd4x = adafruit_scd4x.SCD4X(i2c)
    print("Serial number:", [hex(i) for i in scd4x.serial_number])

    scd4x.start_periodic_measurement()
    print("Waiting for first measurement....")

    while True:
        if scd4x.data_ready:
            temp = "%0.1f" % scd4x.temperature
            humidity = "%0.1f" % scd4x.relative_humidity
            co2 = "%d" % scd4x.CO2
            created_at = datetime.now(timezone('UTC')).strftime("%Y-%m-%d %H:%M:%S")

            print(temp, humidity, co2, created_at)

            sql = """
                INSERT INTO `env_value` (`temperature`, `humidity`, `co2`, `created_at`)
                VALUES (%s, %s, %s, %s)
            """

            conn = _mysql_connection()
            with conn:
                with conn.cursor() as cur:
                    cur.execute(sql, (temp, humidity, co2, created_at))
                conn.commit()

        time.sleep(30)
