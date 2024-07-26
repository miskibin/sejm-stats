from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework import serializers

from api.pagination import ApiViewPagination
from api.serializers.list_serializers import CommitteeListSerializer
from sejm_app.models.committee import (
    Committee,
    CommitteeMember,
    CommitteeSitting,
    CommitteeType,
)


class CommitteeViewSet(ReadOnlyModelViewSet):
    pagination_class = ApiViewPagination
    queryset = Committee.objects.all()
    serializer_class = CommitteeListSerializer
