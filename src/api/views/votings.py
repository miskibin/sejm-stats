from django.db.models import Count, Prefetch, Q
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django_filters import rest_framework as django_filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, serializers
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.viewsets import ReadOnlyModelViewSet, ViewSet

from api.serializers import VotingDetailSerializer
from api.serializers.list_serializers import VotingListSerializer
from sejm_app.models import Voting


class VotingPagination(PageNumberPagination):
    page_size = 1000
    page_size_query_param = "page_size"
    max_page_size = 1500


from django.utils.formats import date_format
from rest_framework import serializers


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
        q_objects = Q()
        for category in categories:
            q_objects |= Q(
                category__in=[
                    key for key, label in Voting.Category.choices if label == category
                ]
            )
        return queryset.filter(q_objects)

    def filter_kinds(self, queryset, name, value):
        kinds = value.split(",")
        q_objects = Q()
        for kind in kinds:
            q_objects |= Q(
                kind__in=[key for key, label in Voting.Kind.choices if label == kind]
            )
        return queryset.filter(q_objects)


class VotingViewSet(ReadOnlyModelViewSet):
    queryset = Voting.objects.all()
    pagination_class = VotingPagination
    filterset_class = VotingFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ["title", "topic"]
    ordering = ["-date"]

    def get_serializer_class(self):
        if self.action == "list":
            return VotingListSerializer
        return VotingDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action == "retrieve":
            return VotingDetailSerializer.setup_eager_loading(queryset)
        return queryset

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
                    {
                        "name": category["category"],
                        "label": (
                            Voting.Category(category["category"]).label
                            if category["category"]
                            else None
                        ),
                        "count": category["count"],
                    }
                    for category in categories
                ],
                "kinds": [
                    {
                        "name": kind["kind"],
                        "label": (
                            Voting.Kind(kind["kind"]).label if kind["kind"] else None
                        ),
                        "count": kind["count"],
                    }
                    for kind in kinds
                ],
                "years": [
                    {"name": year["date__year"], "count": year["count"]}
                    for year in years
                ],
            }
        )
