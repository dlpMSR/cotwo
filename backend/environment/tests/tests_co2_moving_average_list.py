from unittest.mock import patch
from datetime import datetime, timezone, timedelta
from django.test import TestCase
from django.urls import reverse
import random
from ..models import EnvValue


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
    
    def test_number_of_values_response_of_get_last_12_hours(self):
        """過去16時間分のデータが存在した時もget_last_12_hours_values()では過去12時間分のデータまでしか取得できない。
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

    def test_number_of_values_of_co2_ma(self):
        """trend.co2_maの返すデータ数は過去12時間分の30分間移動平均なので、690前後になる
        """
        response = self.client.get(reverse('environment:trend.co2_ma'))
        self.assertTrue(688 < len(response.data) and len(response.data) < 692)
