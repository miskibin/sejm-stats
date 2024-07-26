from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework import serializers
from api.pagination import ApiViewPagination
from api.serializers.list_serializers import EnvoyListSerializer
from sejm_app.models.envoy import Envoy



class EnvoyViewSet(ReadOnlyModelViewSet):
    pagination_class = ApiViewPagination
    queryset = Envoy.objects.all()
    lookup_field = "slug"
    serializer_class = EnvoyListSerializer
