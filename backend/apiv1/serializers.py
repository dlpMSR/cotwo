from rest_framework import serializers
from .models import EnvValue


class EnvValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnvValue
        fields = '__all__'

class Co2Serializer(serializers.ModelSerializer):
    timestamp = serializers.DateTimeField(source='created_at')
    value = serializers.IntegerField(source='co2')
    class Meta:
        model = EnvValue
        fields = ['timestamp', 'value']
