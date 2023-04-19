from django.urls import path
from . import views

urlpatterns = [
    path('env_value', views.EnvValueList.as_view()),
    path('co2_trend', views.Co2TrendList.as_view()),
    path('co2_ma', views.Co2MovingAverageList.as_view()),
    path('temperature_trend', views.TempTrendList.as_view()),
    path('humidity_trend', views.HumidityTrendList.as_view()),
]
