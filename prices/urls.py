from django.urls import path
from .views import LatestGoldPricesView

urlpatterns = [
    path('latest/', LatestGoldPricesView.as_view(), name='latest-prices'),
]