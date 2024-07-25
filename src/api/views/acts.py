from django.db.models import Prefetch
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ReadOnlyModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from rest_framework.response import Response
from django.db.models import Count

from eli_app.models import Act, ActStatus, Institution, Keyword, Publisher


class ActPagination(PageNumberPagination):
    page_size = 1000
    page_size_query_param = "page_size"
    max_page_size = 1000

from rest_framework import serializers
from eli_app.models import Act

class ActSerializer(serializers.ModelSerializer):
    publisher = serializers.CharField(source='publisher.name')
    status = serializers.CharField(source='status.name')
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

class ActViewSet(ReadOnlyModelViewSet):
    queryset = Act.objects.select_related('publisher', 'status', 'releasedBy').all()
    serializer_class = ActSerializer
    pagination_class = ActPagination
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_fields = ["publisher__name", "status__name"]
    search_fields = ["title", "ELI"]
    ordering = ["-announcementDate"]  # Default to most recently changed

    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(cache_page(60 * 60))  # Cache for 1 hour
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
    
    
from rest_framework.viewsets import ViewSet

class ActsMetaViewSet(ViewSet):
    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def list(self, request):
        keywords = Keyword.objects.annotate(act_count=Count('act')).filter(act_count__gt=1)
        publishers = Publisher.objects.all()
        act_statuses = ActStatus.objects.all()
        institutions = Institution.objects.annotate(act_count=Count('act')).filter(act_count__gt=0)

        return Response({
            'keywords': [keyword.name for keyword in keywords],
            'publishers': [publisher.name for publisher in publishers],
            'actStatuses': [status.name for status in act_statuses],
            'institutions': [institution.name for institution in institutions],
        })