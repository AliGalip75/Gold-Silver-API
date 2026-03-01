from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.cache import cache
from django.utils import timezone
from django.db import DatabaseError
from datetime import timedelta
from .models import GoldPrice
# Serializer'ı artık manuel oluşturacağımız için import etmemize gerek yok
from .utils import scrape_gold_prices

class LatestGoldPricesView(APIView):
    
    def get(self, request):
        cache_key = 'latest_gold_prices_with_trend'
        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        try:
            latest_record = GoldPrice.objects.order_by('-created_at').first()
            
            if not latest_record or latest_record.created_at < timezone.now() - timedelta(hours=1):
                scrape_gold_prices()
            
            gold_types = ['gram', 'ceyrek', 'yarim', 'tam', 'gumus']
            enriched_data = []
            
            for g_type in gold_types:
                # Get the last TWO records for this gold type
                records = list(GoldPrice.objects.filter(gold_type=g_type).order_by('-created_at')[:2])
                
                if not records:
                    continue
                    
                latest = records[0]
                # If there's a previous record, use it; otherwise, default to None
                previous = records[1] if len(records) > 1 else None
                
                # Build custom dictionary
                item_data = {
                    "id": latest.id,
                    "gold_type": latest.gold_type,
                    "price_buy": str(latest.price_buy),
                    "price_sell": str(latest.price_sell),
                    "created_at": latest.created_at,
                    # Add previous prices for the app to calculate trends
                    "previous_price_buy": str(previous.price_buy) if previous else None,
                    "previous_price_sell": str(previous.price_sell) if previous else None,
                }
                enriched_data.append(item_data)

            cache.set(cache_key, enriched_data, timeout=3600)

            return Response(enriched_data)

        except DatabaseError as e:
            print(f"Database Error (Probably waking up): {e}")
            return Response(
                {"error": "Veritabanı uykudan uyanıyor, lütfen 15-20 saniye sonra tekrar deneyin."}, 
                status=503
            )
        except Exception as e:
            print(f"Unexpected Error: {e}")
            return Response(
                {"error": "Sunucu tarafında geçici bir hata oluştu."}, 
                status=500
            )