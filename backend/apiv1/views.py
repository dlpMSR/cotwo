from rest_framework.views import APIView
from rest_framework.response import Response
from .models import EnvValue
from .serializers import EnvValueSerializer

class EnvValueList(APIView):
    def get(self, request, format=None):
        eval = EnvValue.objects.order_by('-created_at')[0:1].get()
        serializer = EnvValueSerializer(eval)

        return Response(serializer.data)
