from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ModelViewSet

from community_app.models import Article
from community_app.serializers import ArticleSerializer


class ArticlePageNumberPagination(PageNumberPagination):
    page_size = 4
    page_size_query_param = "page_size"
    max_page_size = 100


class ArticleViewSet(ModelViewSet):
    allowed_methods = ["GET", "OPTIONS", "HEAD"]
    queryset = Article.objects.published()
    serializer_class = ArticleSerializer
    pagination_class = ArticlePageNumberPagination
