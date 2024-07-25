from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework import serializers
from sejm_app.models.envoy import Envoy


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 80
    page_size_query_param = "page_size"
    max_page_size = 500


class EnvoyListSerializer(serializers.ModelSerializer):
    club_photo = serializers.SerializerMethodField()
    photo = serializers.SerializerMethodField()

    class Meta:
        model = Envoy
        fields = [
            "firstName",
            "lastName",
            "educationLevel",
            "numberOfVotes",
            "photo",
            "active",
            "club_photo",
        ]

    def get_club_photo(self, obj):
        return obj.club.photo.url if obj.club.photo else None

    def get_photo(self, obj):
        return obj.photo.url if obj.photo else None


class EnvoyViewSet(ReadOnlyModelViewSet):
    pagination_class = StandardResultsSetPagination
    queryset = Envoy.objects.all()
    lookup_field = "slug"
    serializer_class = EnvoyListSerializer
