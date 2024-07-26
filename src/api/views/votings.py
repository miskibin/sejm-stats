from django.db.models import Prefetch, Count
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import serializers, filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ReadOnlyModelViewSet, ViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from django_filters import rest_framework as django_filters
from django.db.models import Count
from sejm_app.models import Voting
from django.db.models import Q


class VotingPagination(PageNumberPagination):
    page_size = 1000
    page_size_query_param = "page_size"
    max_page_size = 1500


from rest_framework import serializers
from django.utils import timezone
from django.utils.formats import date_format


class VotingSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    kind = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()

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
            "kind",
            "success",
        ]

    def get_category(self, obj):
        return obj.get_category_display()

    def get_kind(self, obj):
        return obj.get_kind_display()

    def get_date(self, obj):
        if obj.date:
            return date_format(
                timezone.localtime(obj.date), format="d E Y, H:i", use_l10n=True
            )
        return None


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
