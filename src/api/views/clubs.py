# In club.py, to create a view for clubs similar to the one in envoys.py, follow these steps:

from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework import serializers

from sejm_app.models.club import Club


class ClubPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = "page_size"
    max_page_size = 100


class ClubSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Club
        fields = ["id", "name", "phone", "fax", "email", "membersCount", "photo_url"]

    def get_photo_url(self, obj):
        return obj.photo.url if obj.photo else None


class ClubViewSet(ReadOnlyModelViewSet):
    pagination_class = ClubPagination
    queryset = Club.objects.all()
    serializer_class = ClubSerializer
