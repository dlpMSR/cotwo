from django.urls import path
from . import views



urlpatterns = [
    path('measurement', views.EnvValueList.as_view()),

    path('trend/temperature', views.TempTrendList.as_view()),
    path('trend/humidity', views.HumidityTrendList.as_view()),
    path('trend/co2', views.Co2TrendList.as_view()),
    path('trend/co2_ma', views.Co2MovingAverageList.as_view())
]
