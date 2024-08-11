from django.db.models import Count, Exists, OuterRef, Prefetch, Q
from rest_framework.viewsets import ReadOnlyModelViewSet

from api.serializers.ClubDetailSerializer import ClubDetailSerializer
from api.serializers.list_serializers import ClubListSerializer
from sejm_app.models.club import Club
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
            club_id = self.kwargs.get(self.lookup_field)
            if club_id == "niez":
                self.kwargs[self.lookup_field] = "niez."
            process_subquery = Exists(
                Envoy.objects.filter(processes=OuterRef("pk"), club=OuterRef("pk"))
            )

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
                process_count=Count(
                    "envoys__processes",
                    filter=Q(envoys__processes__isnull=False),
                    distinct=True,
                ),
            )
        return queryset
