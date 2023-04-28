from rest_framework import serializers
from .models import EnvValue


class EnvValueSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField()
    temperature = serializers.FloatField()
    humidity = serializers.FloatField()
    co2 = serializers.FloatField()
    
    class Meta:
        model = EnvValue
        fields = ['timestamp', 'temperature', 'humidity', 'co2']

class Co2Serializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(source='created_at')
    value = serializers.IntegerField(source='co2')
    class Meta:
        model = EnvValue
        fields = ['timestamp', 'value']

class TempSerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(source='created_at')
    value = serializers.FloatField(source='temperature')
    class Meta:
        model = EnvValue
        fields = ['timestamp', 'value']

class HumiditySerializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(source='created_at')
    value = serializers.FloatField(source='humidity')
    class Meta:
        model = EnvValue
        fields = ['timestamp', 'value']
