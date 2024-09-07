from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from loguru import logger
from rest_framework.response import Response
from rest_framework.views import APIView

from api.serializers import TotalStatsSerializer


class TotalStatsView(APIView):
    @method_decorator(cache_page(60 * 60))  # Cache for 1 hour
    def get(self, request):
        serializer = TotalStatsSerializer(instance=None)
        return Response(serializer.to_representation(None))
