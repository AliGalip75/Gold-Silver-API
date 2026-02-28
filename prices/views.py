from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.cache import cache
from django.utils import timezone
from django.db import DatabaseError
from datetime import timedelta
from .models import GoldPrice
from .serializers import GoldPriceSerializer
from .utils import scrape_gold_prices

class LatestGoldPricesView(APIView):
    
    def get(self, request):
        # Define cache key
        cache_key = 'latest_gold_prices'
        cached_data = cache.get(cache_key)

        # Return cached data if it exists
        if cached_data:
            return Response(cached_data)

        try:
            # Check latest record in database (This is where Neon DB cold start happens)
            latest_record = GoldPrice.objects.order_by('-created_at').first()
            
            # Scrape new data if database is empty or data is older than 1 hour
            if not latest_record or latest_record.created_at < timezone.now() - timedelta(hours=1):
                scrape_gold_prices()
            
            # Get latest price for each gold type
            gold_types = ['gram', 'ceyrek', 'yarim', 'tam', 'gumus']
            latest_prices = []
            
            for g_type in gold_types:
                obj = GoldPrice.objects.filter(gold_type=g_type).order_by('-created_at').first()
                if obj:
                    latest_prices.append(obj)

            # Serialize data
            serializer = GoldPriceSerializer(latest_prices, many=True)
            data = serializer.data

            # Store in RAM cache for 1 hour (3600 seconds)
            cache.set(cache_key, data, timeout=3600)

            return Response(data)

        except DatabaseError as e:
            # Catch Neon DB wake-up timeouts and prevent server lockup
            print(f"Database Error (Probably waking up): {e}")
            return Response(
                {"error": "Veritabanı uykudan uyanıyor, lütfen 15-20 saniye sonra tekrar deneyin."}, 
                status=503
            )
        except Exception as e:
            # Catch any other unexpected errors
            print(f"Unexpected Error: {e}")
            return Response(
                {"error": "Sunucu tarafında geçici bir hata oluştu."}, 
                status=500
            )