from rest_framework import viewsets
from rest_framework.viewsets import ReadOnlyModelViewSet
from api.pagination import ApiViewPagination
from api.serializers.articleSerializer import ArticleListSerializer
from community_app.models import Article
from community_app.serializers import ArticleSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page


class ArticleViewSet(ReadOnlyModelViewSet):
    queryset = Article.objects.all()
    pagination_class = ApiViewPagination
    lookup_field = "id"

    def get_serializer_class(self):
        if self.action == "list":
            return ArticleListSerializer
        return ArticleSerializer

    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
