from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"^ws/env_values$", consumers.Consumer.as_asgi()),
]
