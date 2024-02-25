from django.urls import path
from . import views


urlpatterns = [
    path('measurement', views.EnvValueList.as_view(), name='measurement'),

    path('trend/temperature', views.TempTrendList.as_view(), name='trend.temperature'),
    path('trend/humidity', views.HumidityTrendList.as_view()),
    path('trend/co2', views.Co2TrendList.as_view(), name='trend.co2'),
    path('trend/co2_ma', views.Co2MovingAverageList.as_view(), name='trend.co2_ma')
]
