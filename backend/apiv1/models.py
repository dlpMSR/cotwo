from django.db import models

# Create your models here.
class EnvValue(models.Model):
    temperature = models.FloatField()
    humidity = models.FloatField()
    co2 = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'env_value'
