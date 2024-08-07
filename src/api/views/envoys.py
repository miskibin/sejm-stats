from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ReadOnlyModelViewSet

from api.pagination import ApiViewPagination
from api.serializers import EnvoyDetailSerializer
from api.serializers.list_serializers import EnvoyListSerializer
from sejm_app.models.envoy import Envoy


class EnvoyViewSet(ReadOnlyModelViewSet):
    pagination_class = ApiViewPagination
    queryset = Envoy.objects.all()
    lookup_field = "id"

    def get_serializer_class(self):
        if self.action == "list":
            return EnvoyListSerializer
        return EnvoyDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == "retrieve":
            return EnvoyDetailSerializer.setup_eager_loading(queryset)
        return queryset
