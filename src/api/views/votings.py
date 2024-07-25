from django.db.models import Prefetch, Count
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import serializers, filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ReadOnlyModelViewSet, ViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from django_filters import rest_framework as django_filters

from sejm_app.models import Voting


class VotingPagination(PageNumberPagination):
    page_size = 200
    page_size_query_param = "page_size"
    max_page_size = 1500


class VotingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Voting
        fields = [
            "id",
            "yes",
            "no",
            "abstain",
            "category",
            "term",
            "sitting",
            "sittingDay",
            "votingNumber",
            "date",
            "title",
            "description",
            "topic",
            "prints",
            "pdfLink",
            "kind",
            "success",
        ]


class VotingFilter(django_filters.FilterSet):
    categories = django_filters.CharFilter(method="filter_categories")
    kinds = django_filters.CharFilter(method="filter_kinds")
    start_date = django_filters.DateFilter(field_name="date", lookup_expr="gte")
    end_date = django_filters.DateFilter(field_name="date", lookup_expr="lte")

    class Meta:
        model = Voting
        fields = [
            "categories",
            "kinds",
            "start_date",
            "end_date",
        ]

    def filter_categories(self, queryset, name, value):
        categories = value.split(",")
        return queryset.filter(category__in=categories)

    def filter_kinds(self, queryset, name, value):
        kinds = value.split(",")
        return queryset.filter(kind__in=kinds)


class VotingViewSet(ReadOnlyModelViewSet):
    queryset = Voting.objects.all()
    serializer_class = VotingSerializer
    pagination_class = VotingPagination
    filterset_class = VotingFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ["title", "topic"]
    ordering = ["-date"]

    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(cache_page(60 * 60))  # Cache for 1 hour
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)


class VotingsMetaViewSet(ViewSet):
    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def list(self, request):
        categories = (
            Voting.objects.values("category")
            .annotate(count=Count("category"))
            .order_by("-count")
        )
        kinds = (
            Voting.objects.values("kind")
            .annotate(count=Count("kind"))
            .order_by("-count")
        )
        years = (
            Voting.objects.values("date__year")
            .annotate(count=Count("date__year"))
            .order_by("date__year")
            .distinct()
        )

        return Response(
            {
                "categories": [
                    {"name": category["category"], "count": category["count"]}
                    for category in categories
                ],
                "kinds": [
                    {"name": kind["kind"], "count": kind["count"]} for kind in kinds
                ],
                "years": [
                    {"name": year["date__year"], "count": year["count"]}
                    for year in years
                ],
            }
        )
