from unittest.mock import patch
from datetime import datetime, timedelta
from django.test import TestCase
from django.urls import reverse
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
        test_time = datetime.now() - timedelta(seconds=7200)
        with patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = test_time
            EnvValue.objects.create(temperature=24.4, humidity=64.5, co2=921)

        response = self.client.get(reverse('environment:trend.co2'))
        self.assertEqual(len(response.data), 1)

    def test_yesterdays_record(self):
        """12時間前より以前のデータしかない場合は、返されるJSONの配列の要素数は0になる。
        """
        test_time = datetime.now() - timedelta(seconds=43200)
        with patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = test_time
            EnvValue.objects.create(temperature=24.4, humidity=64.5, co2=921)

        response = self.client.get(reverse('environment:trend.co2'))
        self.assertEqual(len(response.data), 0)

    def test_type_co2_value(self):
        """返されるJSONのうち、CO2濃度の値は整数になっている。
        """
        EnvValue.objects.create(temperature=24.4, humidity=64.5, co2=921)
        
        response = self.client.get(reverse('environment:trend.co2'))
        self.assertIsInstance(response.data[0]['value'], int)
