from django.db.models import Prefetch, Count, Q, Case, When, Value, CharField, F
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import serializers, filters
from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ReadOnlyModelViewSet, ViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from django_filters import rest_framework as django_filters
from django.utils import timezone
from django.utils.formats import date_format
from api.serializers.detail_serializers import ProcessDetailSerializer
from api.serializers.list_serializers import ProcessListSerializer
from sejm_app.models import Process, Club, Envoy
from sejm_app.models.process import CreatedByEnum


class ProcessPagination(PageNumberPagination):
    page_size = 1000
    page_size_query_param = "page_size"
    max_page_size = 1500



class ProcessFilter(django_filters.FilterSet):
    createdBy = django_filters.CharFilter(method="filter_createdBy")
    documentType = django_filters.CharFilter(lookup_expr="icontains")
    start_date = django_filters.DateFilter(
        field_name="processStartDate", lookup_expr="gte"
    )
    end_date = django_filters.DateFilter(
        field_name="processStartDate", lookup_expr="lte"
    )
    length_tag = django_filters.CharFilter(method="filter_length_tag")
    MPs_from_club = django_filters.CharFilter(method="filter_MPs_from_club")

    class Meta:
        model = Process
        fields = [
            "createdBy",
            "documentType",
            "start_date",
            "end_date",
            "length_tag",
            "MPs_from_club",
        ]

    def filter_createdBy(self, queryset, name, value):
        created_by_values = value.split(",")
        q_objects = Q()
        for val in created_by_values:
            q_objects |= Q(
                createdBy__in=[
                    key for key, label in CreatedByEnum.choices if label == val
                ]
            )
        return queryset.filter(q_objects)

    def filter_length_tag(self, queryset, name, value):
        length_tags = value.split(",")
        q_objects = Q()
        for tag in length_tags:
            if tag == "bardzo krótki":
                q_objects |= Q(pagesCount__lt=3)
            elif tag == "krótki":
                q_objects |= Q(pagesCount__gte=3, pagesCount__lt=10)
            elif tag == "średni":
                q_objects |= Q(pagesCount__gte=10, pagesCount__lt=20)
            elif tag == "długi":
                q_objects |= Q(pagesCount__gte=20)
        return queryset.filter(q_objects)

    def filter_MPs_from_club(self, queryset, name, value):
        club_ids = value.split(",")
        return queryset.filter(
            Q(club__id__in=club_ids) | Q(MPs__club__id__in=club_ids)
        ).distinct()

class ProcessViewSet(ReadOnlyModelViewSet):
    queryset = Process.objects.all()
    pagination_class = ProcessPagination
    filterset_class = ProcessFilter
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    search_fields = ["title", "description"]
    ordering = ["-processStartDate"]

    def get_serializer_class(self):
        if self.action == 'list':
            return ProcessListSerializer
        return ProcessDetailSerializer

    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(cache_page(60 * 60))  # Cache for 1 hour
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

class ProcessesMetaViewSet(ViewSet):
    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def list(self, request):
        created_by = (
            Process.objects.values("createdBy")
            .annotate(count=Count("createdBy"))
            .order_by("-count")
        )
        document_types = (
            Process.objects.values("documentType")
            .annotate(count=Count("documentType"))
            .order_by("-count")
        )
        years = (
            Process.objects.values("processStartDate__year")
            .annotate(count=Count("processStartDate__year"))
            .order_by("processStartDate__year")
            .distinct()
        )
        # length_tags = (
        #     Process.objects.annotate(
        #         length_tag=Case(
        #             When(pagesCount__lt=3, then=Value('bardzo krótki')),
        #             When(pagesCount__lt=10, then=Value('krótki')),
        #             When(pagesCount__lt=20, then=Value('średni')),
        #             default=Value('długi'),
        #             output_field=CharField(),
        #         )
        #     )
        #     .values('length_tag')
        #     .annotate(count=Count('length_tag'))
        #     .order_by('-count')
        # )
        clubs = (
            Club.objects.annotate(
                process_count=Count("envoys__processes", distinct=True)
            )
            .order_by("-process_count")
            .values("id", "process_count")
        )

        return Response(
            {
                "createdBy": [
                    {"name": item["createdBy"], "count": item["count"]}
                    for item in created_by
                ],
                "documentTypes": [
                    {"name": item["documentType"], "count": item["count"]}
                    for item in document_types
                ],
                "years": [
                    {"name": item["processStartDate__year"], "count": item["count"]}
                    for item in years
                ],
                # 'lengthTags': [
                #     {
                #         'name': item['length_tag'],
                #         'count': item['count']
                #     }
                #     for item in length_tags
                # ],
                "clubs": [
                    {"name": item["id"], "count": item["process_count"]}
                    for item in clubs
                ],
            }
        )
