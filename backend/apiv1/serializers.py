from rest_framework import serializers
from .models import EnvValue


class EnvValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnvValue
        fields = '__all__'
