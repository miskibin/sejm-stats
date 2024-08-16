from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ReadOnlyModelViewSet

from api.pagination import ApiViewPagination
from api.serializers.CommitteeDetailSerialzer import CommitteeDetailSerializer
from api.serializers.list_serializers import CommitteeListSerializer
from sejm_app.models.committee import Committee


class CommitteeViewSet(ReadOnlyModelViewSet):
    queryset = Committee.objects.all()
    pagination_class = ApiViewPagination
    lookup_field = "code"

    def get_serializer_class(self):
        if self.action == "list":
            return CommitteeListSerializer
        return CommitteeDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == "retrieve":
            return CommitteeDetailSerializer.setup_eager_loading(queryset)
        return queryset

    @method_decorator(cache_page(60 * 15))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(cache_page(60 * 15))
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
