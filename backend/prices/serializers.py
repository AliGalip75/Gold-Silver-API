from rest_framework import serializers
from .models import GoldPrice

class GoldPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoldPrice
        fields = ['id', 'gold_type', 'price_buy', 'price_sell', 'created_at']
        read_only_fields = ['id', 'created_at']