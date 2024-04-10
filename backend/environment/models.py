from django.db import models
import datetime

class EnvValueManager(models.Manager):
    def get_last_12_hours_values(self):
        """過去12時間分の環境値の記録を返す
        """
        now_utc = datetime.datetime.now(datetime.timezone.utc)
        twelve_hours_ago = now_utc - datetime.timedelta(hours=12)

        return self.order_by('-created_at').filter(created_at__range=[twelve_hours_ago, now_utc])
    
class EnvValue(models.Model):
    id = models.AutoField(primary_key=True)
    temperature = models.FloatField()
    humidity = models.FloatField()
    co2 = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    objects = EnvValueManager()

    class Meta:
        db_table = 'env_value'
