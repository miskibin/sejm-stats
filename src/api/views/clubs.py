# In club.py, to create a view for clubs similar to the one in envoys.py, follow these steps:

from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ReadOnlyModelViewSet

from api.serializers.list_serializers import ClubListSerializer
from sejm_app.models.club import Club


class ClubViewSet(ReadOnlyModelViewSet):
    queryset = Club.objects.all()
    serializer_class = ClubListSerializer
