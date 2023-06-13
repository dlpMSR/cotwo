from django.test import TestCase
from unittest.mock import patch
from datetime import datetime, timezone, timedelta
from ..models import EnvValue


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
