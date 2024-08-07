from rest_framework import viewsets
from rest_framework.response import Response

from api.serializers.list_serializers import ArticleContextSerializer


class ArticleContextViewSet(viewsets.ViewSet):
    def list(self, request):
        serializer = ArticleContextSerializer({})
        return Response(serializer.data)
