import redis
from django.test import TestCase
from unittest.mock import patch
from ..utils import get_redis_handle


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
