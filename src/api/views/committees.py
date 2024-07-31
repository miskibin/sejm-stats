from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework import serializers

from api.pagination import ApiViewPagination
from api.serializers.CommitteeDetailSerialzer import CommitteeDetailSerializer
from api.serializers.list_serializers import CommitteeListSerializer
from sejm_app.models.committee import (
    Committee,
)


# return CommitteeDetailSerializer.setup_eager_loading(super().get_queryset())
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
