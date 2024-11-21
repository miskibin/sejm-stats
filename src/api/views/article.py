from rest_framework import viewsets, status
from rest_framework.response import Response
from api.pagination import ApiViewPagination
from api.serializers.articleSerializer import ArticleListSerializer
from community_app.models import Article
from community_app.serializers import ArticleSerializer
from loguru import logger
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.exceptions import PermissionDenied

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    pagination_class = ApiViewPagination
    lookup_field = "id"
    ALLOWED_ORIGIN = 'sejm-stats.pl'

    def get_serializer_class(self):
        if self.action == "list":
            return ArticleListSerializer
        return ArticleSerializer

    def check_origin(self, request):
        """Check if the request origin is allowed"""
        origin = request.headers.get('Origin', '')
        logger.debug(f"Request origin: {origin}")
        
        if self.action in ['create', 'destroy']:
            if not origin.endswith(self.ALLOWED_ORIGIN):
                logger.warning(f"Unauthorized access attempt from origin: {origin}")
                raise PermissionDenied(f"Operations only allowed from {self.ALLOWED_ORIGIN}")

    def initial(self, request, *args, **kwargs):
        """Run origin check before any action is processed"""
        super().initial(request, *args, **kwargs)
        self.check_origin(request)

    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            logger.error(f"Validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        logger.info(f"Article created successfully from origin: {request.headers.get('Origin')}")
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        logger.info(f"Deleting article {instance.id} from origin: {request.headers.get('Origin')}")
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_create(self, serializer):
        serializer.save()