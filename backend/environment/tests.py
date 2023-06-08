from unittest.mock import patch
from datetime import datetime, timezone, timedelta
from django.test import TestCase
from django.urls import reverse
import random
from .models import EnvValue
from .utils import get_redis_handle
import redis

class RedisSetupTests(TestCase):
    def test_appropriate_host_port(self):
        """get_redis_handle()すると、Redisインスタンスが返る
        """
        conn = get_redis_handle()
        self.assertIs(type(conn), redis.client.Redis)
    
    def test_incorrect_host_port(self):
        """get_redis_handle()で生成したRedisクライアントのホスト名とポート番号は、環境変数によって変わる。
        """
        with patch.dict("os.environ", {"REDIS_HOST": "redis_host_test", "REDIS_PORT": "5200"}):
            conn = get_redis_handle()
            conn_kwags = conn.get_connection_kwargs()
            self.assertEqual(conn_kwags['host'], "redis_host_test")
            self.assertEqual(conn_kwags['port'], 5200)


class EnvValueTests(TestCase):
    def test_get_last_12_hours_with_one_record(self):
        """計測値として2時間前のデータが一件だけ保存されている場合、返されるJSONの配列の要素数は1になる。
        """
        test_time = datetime.now(timezone.utc) - timedelta(seconds=7200)
        with patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = test_time
            EnvValue.objects.create(temperature=24.4, humidity=64.5, co2=921)

        values = EnvValue.objects.get_last_12_hours_values()
        self.assertEqual(values.count(), 1)

    def test_get_last_12_hours_with_record_more_than_12_hours_ago(self):
        """計測値として12時間前より以前のデータしかない場合は、返されるJSONの配列の要素数は0になる。
        """
        test_time = datetime.now(timezone.utc) - timedelta(seconds=43200)
        with patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = test_time
            EnvValue.objects.create(temperature=24.4, humidity=64.5, co2=921)

        values = EnvValue.objects.get_last_12_hours_values()
        self.assertEqual(values.count(), 0)


class EnvValueViewTests(TestCase):
    @patch('redis.client.Redis.get')
    def test_valid_cache_status(self, patch_redis_get):
        """Redisのキャッシュから環境値が得られる場合、environment/measurementにアクセスすると200が返る。
        """
        patch_redis_get.return_value = b'{"temperature": 43.3, "humidity": 74.3, "co2": 959.3, "timestamp": "2023-05-31 08:01:53"}'

        response = self.client.get(reverse("environment:measurement"))
        self.assertEqual(response.status_code, 200)
    
    @patch('redis.client.Redis.get')
    def test_no_cache(self, patch_redis_get):
        """Redisのキャッシュに環境値が存在しない場合、conn.get()はNoneを返す。その場合にenvironment/measurementにアクセスすると503が返る。
        """
        patch_redis_get.return_value = None
        response = self.client.get(reverse("environment:measurement"))
        self.assertEqual(response.status_code, 503)

    @patch.dict("os.environ", {"REDIS_HOST": "invalid_host", "REDIS_PORT": "20000"})
    def test_cannot_connect_redis(self):
        """djangoがRedisに接続できない場合、environment/measurementにアクセスすると500が返る。
        """
        response = self.client.get(reverse("environment:measurement"))
        self.assertEqual(response.status_code, 500)


class Co2TrendListTest(TestCase):
    def test_one_record(self):
        """計測値として2時間前のデータが一件だけ保存されている場合、返されるJSONの配列の要素数は1になる。
        """
        test_time = datetime.now(timezone.utc) - timedelta(seconds=7200)
        with patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = test_time
            EnvValue.objects.create(temperature=24.4, humidity=64.5, co2=921)

        response = self.client.get(reverse('environment:trend.co2'))
        self.assertEqual(len(response.data), 1)

    def test_yesterdays_record(self):
        """12時間前より以前のデータしかない場合は、返されるJSONの配列の要素数は0になる。
        """
        test_time = datetime.now(timezone.utc) - timedelta(seconds=43200)
        with patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = test_time
            EnvValue.objects.create(temperature=24.4, humidity=64.5, co2=921)

        response = self.client.get(reverse('environment:trend.co2'))
        self.assertEqual(len(response.data), 0)

    def test_response_data_format(self):
        """返されるデータの形式は、timestampとvalueの組み合わせの配列になっている。
        """
        EnvValue.objects.create(temperature=24.4, humidity=64.5, co2=921)
        test_time = datetime.now(timezone.utc) - timedelta(seconds=7200)
        with patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = test_time
            EnvValue.objects.create(temperature=25.1, humidity=52.5, co2=841)
        
        response = self.client.get(reverse('environment:trend.co2'))
        
        self.assertEqual(len(response.data), 2)                # レスポンスのデータ数は2
        self.assertTrue(hasattr(response.data, "__iter__"))    # レスポンスのデータはiterable

        elem = response.data[0]
        self.assertEqual(type(elem['value']), int)             # valueは整数
        self.assertEqual(type(elem['timestamp']), str)         # timestampは文字列
        self.assertEqual(                                      # timestampはfromisoformat()でdatetimeに変換できる
            type(datetime.fromisoformat(elem['timestamp'])),
            datetime
        )


class Co2MovingAverageListTests(TestCase):
    def setUp(self):
        # 過去16時間の環境値データを作成
        test_time = datetime.now(timezone.utc) - timedelta(seconds=57600)
        for i in range(60 * 16):
            test_time = test_time + timedelta(seconds=(60))
            with patch('django.utils.timezone.now') as mock_now:
                mock_now.return_value = test_time
                EnvValue.objects.create(
                    temperature=round(random.uniform(0, 50), 1),
                    humidity=round(random.uniform(0, 100), 1),
                    co2="%d" % int(random.uniform(400, 1500))
                )
    
    def test_number_of_values_last_12_hours(self):
        """過去15時間分のデータが存在した時もget_last_12_hours_values()では過去12時間分のデータまでしか取得できない。
        """
        values = EnvValue.objects.get_last_12_hours_values()
        self.assertEqual(values.count(), 720)

    def test_response_data_format(self):
        """返されるデータの形式は、timestampとvalueの組み合わせの配列になっている。
        """
        response = self.client.get(reverse('environment:trend.co2_ma'))
        self.assertTrue(hasattr(response.data, "__iter__"))     # レスポンスのデータはiterable

        elem = response.data[0]
        self.assertEqual(type(elem['timestamp']), str)        # timestampは文字列
        self.assertEqual(                                     # timestampはfromisoformat()でdatetimeに変換できる
            type(datetime.fromisoformat(elem['timestamp'])),
            datetime
        )

        self.assertEqual(type(elem['value']), float)          # 各値は小数になっている
        val_sample = str(elem['value'])
        self.assertTrue(len(val_sample.split('.')[1]) < 2)    # 各値は小数第一位で丸められている

