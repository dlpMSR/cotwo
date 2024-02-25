from django.test import TestCase
from django.urls import reverse
from unittest.mock import patch
from datetime import datetime, timezone, timedelta
from ..models import EnvValue


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
