from django.shortcuts import render
from rest_framework import viewsets
from .models import EnvValue
from .serializers import EnvValueSerializer

# Create your views here.
class EnvValueViewSet(viewsets.ModelViewSet):
    queryset = EnvValue.objects.all()
    serializer_class = EnvValueSerializer
