from rest_framework.views import APIView
from rest_framework.response import Response
from .models import EnvValue
from .serializers import EnvValueSerializer
from .serializers import Co2Serializer
from .serializers import TempSerializer
from .serializers import HumiditySerializer
import datetime

class EnvValueList(APIView):
    def get(self, request, format=None):
        eval = EnvValue.objects.order_by('-created_at')[0:1].get()
        serializer = EnvValueSerializer(eval)

        return Response(serializer.data)

class Co2TrendList(APIView):
    def get(self, request, format=None):
        now_utc = datetime.datetime.now(datetime.timezone.utc)
        six_hours_ago = now_utc - datetime.timedelta(hours=6)
        co2_values = EnvValue.objects.order_by('-created_at') \
            .filter(created_at__range=[six_hours_ago, now_utc])
        
        serializer = Co2Serializer(co2_values, many=True)

        return Response(serializer.data)

class TempTrendList(APIView):
    def get(self, request, format=None):
        now_utc = datetime.datetime.now(datetime.timezone.utc)
        six_hours_ago = now_utc - datetime.timedelta(hours=6)
        values = EnvValue.objects.order_by('-created_at') \
            .filter(created_at__range=[six_hours_ago, now_utc])
        
        serializer = TempSerializer(values, many=True)

        return Response(serializer.data)

class HumidityTrendList(APIView):
    def get(self, request, format=None):
        now_utc = datetime.datetime.now(datetime.timezone.utc)
        six_hours_ago = now_utc - datetime.timedelta(hours=6)
        values = EnvValue.objects.order_by('-created_at') \
            .filter(created_at__range=[six_hours_ago, now_utc])
        
        serializer = HumiditySerializer(values, many=True)

        return Response(serializer.data)
