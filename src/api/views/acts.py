from django.db.models import Prefetch, Count
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import serializers, filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ReadOnlyModelViewSet, ViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from django_filters import rest_framework as django_filters

from eli_app.models import Act, ActStatus, Institution, Keyword, Publisher


class ActPagination(PageNumberPagination):
    page_size = 1500
    page_size_query_param = "page_size"
    max_page_size = 1500


class ActSerializer(serializers.ModelSerializer):
    publisher = serializers.CharField(source="publisher.name")
    status = serializers.CharField(source="status.name")
    releasedBy = serializers.SerializerMethodField()

    class Meta:
        model = Act
        fields = [
            "ELI",
            "publisher",
            "status",
            "title",
            "releasedBy",
            "announcementDate",
            "entryIntoForce",
        ]

    def get_releasedBy(self, obj):
        return obj.releasedBy.name if obj.releasedBy else None


class ActFilter(django_filters.FilterSet):
    publishers = django_filters.CharFilter(method="filter_publishers")
    keywords = django_filters.CharFilter(method="filter_keywords")
    statuses = django_filters.CharFilter(method="filter_statuses")
    institutions = django_filters.CharFilter(method="filter_institutions")
    start_date = django_filters.DateFilter(
        field_name="announcementDate", lookup_expr="gte"
    )
    end_date = django_filters.DateFilter(
        field_name="announcementDate", lookup_expr="lte"
    )
    years = django_filters.CharFilter(method="filter_years")

    class Meta:
        model = Act
        fields = [
            "publishers",
            "keywords",
            "years",
            "statuses",
            "institutions",
            "start_date",
            "end_date",
        ]

    def filter_years(self, queryset, name, value):
        years = value.split(",")
        return queryset.filter(year__in=years)

    def filter_publishers(self, queryset, name, value):
        publishers = value.split(",")
        return queryset.filter(publisher__name__in=publishers)

    def filter_keywords(self, queryset, name, value):
        keywords = value.split(",")
        return queryset.filter(keywords__name__in=keywords)

    def filter_statuses(self, queryset, name, value):
        statuses = value.split(",")
        return queryset.filter(status__name__in=statuses)

    def filter_institutions(self, queryset, name, value):
        institutions = value.split(",")
        return queryset.filter(releasedBy__name__in=institutions)


class ActViewSet(ReadOnlyModelViewSet):
    queryset = (
        Act.objects.select_related("publisher", "status", "releasedBy")
        .prefetch_related("keywords")
        .all()
    )
    serializer_class = ActSerializer
    pagination_class = ActPagination
    filterset_class = ActFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ["title", "ELI"]
    ordering = ["-announcementDate"]

    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(cache_page(60 * 60))  # Cache for 1 hour
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


class ActsMetaViewSet(ViewSet):
    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def list(self, request):
        keywords = (
            Keyword.objects.annotate(act_count=Count("act"))
            .filter(act_count__gt=1)
            .order_by("-act_count")
        )
        publishers = Publisher.objects.annotate(act_count=Count("act")).order_by(
            "-act_count"
        )
        act_statuses = (
            ActStatus.objects.annotate(act_count=Count("act"))
            .filter(act_count__gt=0)
            .order_by("-act_count")
        )
        institutions = (
            Institution.objects.annotate(act_count=Count("act"))
            .filter(act_count__gt=0)
            .order_by("-act_count")
        )
        years = (
            Act.objects.values("year")
            .annotate(count=Count("year"))
            .order_by("year")
            .distinct()
        )

        return Response(
            {
                "keywords": [
                    {"name": keyword.name, "count": keyword.act_count}
                    for keyword in keywords
                ],
                "publishers": [
                    {"name": publisher.name, "count": publisher.act_count}
                    for publisher in publishers
                ],
                "actStatuses": [
                    {"name": status.name, "count": status.act_count}
                    for status in act_statuses
                ],
                "institutions": [
                    {"name": institution.name, "count": institution.act_count}
                    for institution in institutions
                ],
                "years": [
                    {"name": year["year"], "count": year["count"]} for year in years
                ],
            }
        )
