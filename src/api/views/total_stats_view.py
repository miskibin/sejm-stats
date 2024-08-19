from loguru import logger
from rest_framework.response import Response
from rest_framework.views import APIView

from api.serializers import TotalStatsSerializer


class TotalStatsView(APIView):
    def get(self, request):
        serializer = TotalStatsSerializer(instance=None)
        return Response(serializer.to_representation(None))
