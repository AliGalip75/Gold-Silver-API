from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.cache import cache
from django.utils import timezone
from datetime import timedelta
from .models import GoldPrice
from .serializers import GoldPriceSerializer
from .utils import scrape_gold_prices

class LatestGoldPricesView(APIView):
    def get(self, request):
        cache_key = 'latest_gold_prices'
        cached_data = cache.get(cache_key)

        # Force query parameter to bypass cache and force scraping (for testing)
        force_update = request.query_params.get('force') == 'true'

        if cached_data and not force_update:
            return Response(cached_data)

        latest_record = GoldPrice.objects.order_by('-created_at').first()
        
        # Reduced to 1 minute for testing, and respects force parameter
        if force_update or not latest_record or latest_record.created_at < timezone.now() - timedelta(minutes=1):
            try:
                scrape_gold_prices()
                # Print to explicitly show in logs if scraping was attempted
                print("DEBUG: Scrape function called successfully.") 
            except Exception as e:
                # Print error directly to response for immediate debugging
                return Response({"error": "Scraping failed", "details": str(e)}, status=500)
        
        gold_types = ['gram', 'ceyrek', 'yarim', 'tam', 'gumus']
        latest_prices = []
        
        for g_type in gold_types:
            obj = GoldPrice.objects.filter(gold_type=g_type).order_by('-created_at').first()
            if obj:
                latest_prices.append(obj)

        serializer = GoldPriceSerializer(latest_prices, many=True)
        data = serializer.data

        # Cache set to 60 seconds for testing
        cache.set(cache_key, data, timeout=60)

        return Response(data)