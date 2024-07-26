from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, serializers
from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ReadOnlyModelViewSet

from api.pagination import ApiViewPagination
from api.serializers.list_serializers import InterpellationListSerializer
from sejm_app.models.interpellation import Interpellation




class InterpellationViewSet(ReadOnlyModelViewSet):
    queryset = Interpellation.objects.all()
    serializer_class = InterpellationListSerializer
    pagination_class = ApiViewPagination

    ordering = ["-receiptDate"]  # Default to most recently received

    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(cache_page(60 * 60))  # Cache for 1 hour
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
