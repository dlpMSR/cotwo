from django.urls import path
from . import views

urlpatterns = [
    path('env_value', views.EnvValueList.as_view()),
    path('co2_trend', views.Co2TrendList.as_view())
]
