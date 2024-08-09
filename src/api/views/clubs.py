from api.serializers.ClubDetailSerializer import ClubDetailSerializer
from api.serializers.list_serializers import ClubListSerializer
from sejm_app.models.club import Club
from rest_framework.viewsets import ReadOnlyModelViewSet
from django.db.models import Count, Prefetch

from sejm_app.models.envoy import Envoy


class ClubViewSet(ReadOnlyModelViewSet):
    queryset = Club.objects.all()
    lookup_field = "id"

    def get_serializer_class(self):
        if self.action == "list":
            return ClubListSerializer
        return ClubDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == "retrieve":
            return queryset.prefetch_related(
                Prefetch(
                    "envoys",
                    queryset=Envoy.objects.only(
                        "id", "firstName", "lastName", "districtName"
                    ),
                ),
                "votes",
            ).annotate(
                interpellation_count=Count("envoys__interpellations", distinct=True),
                process_count=Count("processes", distinct=True),
            )
        return queryset
