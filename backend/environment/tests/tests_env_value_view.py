from django.test import TestCase
from django.urls import reverse
from unittest.mock import patch


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
