from django.test import TestCase
from django.urls import reverse
from datetime import datetime, timezone, timedelta
from unittest.mock import patch
from ..models import EnvValue
import random


class TempTrendListOnSmallSampleTest(TestCase):
    def test_one_record(self):
        """計測値として2時間前のデータが一件だけ保存されている場合、返されるJSONの配列の要素数は1になる。
        """
        test_time = datetime.now(timezone.utc) - timedelta(seconds=7200)
        with patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = test_time
            EnvValue.objects.create(temperature=24.4, humidity=64.5, co2=921)

        response = self.client.get(reverse('environment:trend.temperature'))
        self.assertEqual(len(response.data), 1)

    def test_yesterdays_record(self):
        """12時間より以前のデータしかない場合は、返されるJSONの配列の要素数は0になる。
        """
        test_time = datetime.now(timezone.utc) - timedelta(seconds=43200) # 43200/3600 = 12
        with patch('django.utils.timezone.now') as mock_now:
            mock_now.return_value = test_time
            EnvValue.objects.create(temperature=24.4, humidity=64.5, co2=921)
        
        response = self.client.get(reverse('environment:trend.temperature'))
        self.assertEqual(len(response.data), 0)

    def test_response_data_format(self):
        """返されるデータの形式は、timestampとvalueの組み合わせの配列になっている。
        """
        EnvValue.objects.create(temperature=24.4, humidity=64.5, co2=921)
        response = self.client.get(reverse('environment:trend.temperature'))

        self.assertTrue(hasattr(response.data, "__iter__"))    # レスポンスのデータはiterable

        elem = response.data[0]
        self.assertEqual(type(elem['value']), float)            # valueは小数を含む
        self.assertEqual(type(elem['timestamp']), str)          # timestampは文字列
        self.assertEqual(                                       # timestampはfromisoformat()でdatetimeに変換できる
            type(datetime.fromisoformat(elem['timestamp'])),
            datetime
        )

class TempTrendList(TestCase):
    def setUp(self):
        # 過去16時間・1分毎の環境値データを作成
        test_time = datetime.now(timezone.utc) - timedelta(seconds=16 * 3600)
        for i in range(60 * 16):
            test_time = test_time + timedelta(seconds=60)
            with patch('django.utils.timezone.now') as mock_now:
                mock_now.return_value = test_time
                EnvValue.objects.create(
                    temperature=round(random.uniform(0, 50), 1),
                    humidity=round(random.uniform(0, 100), 1),
                    co2="%d" % int(random.uniform(400, 1500))
                )

    def test_number_of_data_contained_in_response(self):
        """過去16時間分のデータが存在した時も、trend.temperatureは過去12時間分のデータだけを返す。
        """
        response = self.client.get(reverse('environment:trend.temperature'))
        self.assertEqual(len(response.data), 720)
