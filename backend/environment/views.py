from redis.exceptions import ConnectionError
from rest_framework.views import APIView
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from .models import EnvValue
from .serializers import EnvValueSerializer
from .serializers import Co2Serializer
from .serializers import TempSerializer
from .serializers import HumiditySerializer
from .utils import get_redis_handle
import datetime
import json
import pandas as pd

class EnvValueList(APIView):
    def get(self, request, format=None):
        conn = get_redis_handle()

        try:
            measurement = conn.get('scd41:measurement')
        except ConnectionError:
            raise RedisConnectionError()

        if measurement:
            envval = json.loads(measurement)
            serializer = EnvValueSerializer(envval)
            return Response(serializer.data)
        else:
            raise LatestMeasurementUnavailableError()

class Co2TrendList(APIView):
    def get(self, request, format=None):
        values = EnvValue.objects.get_last_12_hours_values()
        serializer = Co2Serializer(values, many=True)

        return Response(serializer.data)

class Co2MovingAverageList(APIView):
    def get(self, request, format=None):
        now_utc = datetime.datetime.now(datetime.timezone.utc)
        six_hours_ago = now_utc - datetime.timedelta(hours=12)
        co2_values = EnvValue.objects.order_by('-created_at') \
            .filter(created_at__range=[six_hours_ago, now_utc]) \
            .values_list('created_at', 'co2')
        
        df = pd.DataFrame(co2_values, columns=['created_at', 'co2'])
        df["co2"] = df["co2"].rolling(30, center=True).mean()
        co2_mvaves = df.dropna(how='any').to_dict('records')

        serializer = Co2Serializer(co2_mvaves, many=True)

        return Response(serializer.data)

class TempTrendList(APIView):
    def get(self, request, format=None):
        now_utc = datetime.datetime.now(datetime.timezone.utc)
        six_hours_ago = now_utc - datetime.timedelta(hours=12)
        values = EnvValue.objects.order_by('-created_at') \
            .filter(created_at__range=[six_hours_ago, now_utc])
        
        serializer = TempSerializer(values, many=True)

        return Response(serializer.data)

class HumidityTrendList(APIView):
    def get(self, request, format=None):
        now_utc = datetime.datetime.now(datetime.timezone.utc)
        six_hours_ago = now_utc - datetime.timedelta(hours=12)
        values = EnvValue.objects.order_by('-created_at') \
            .filter(created_at__range=[six_hours_ago, now_utc])
        
        serializer = HumiditySerializer(values, many=True)

        return Response(serializer.data)

class LatestMeasurementUnavailableError(APIException):
    status_code = 503
    default_detail = 'The sensor measurements are temporarily unavailable.'
    default_code = ''

class RedisConnectionError(APIException):
    status_code = 500
    default_detail = 'Failed to connect to Redis.'
    default_code = ''
