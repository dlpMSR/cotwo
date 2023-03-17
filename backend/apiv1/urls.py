from django.urls import path
from . import views

urlpatterns = [
    path('env_value', views.EnvValueList.as_view())
]
