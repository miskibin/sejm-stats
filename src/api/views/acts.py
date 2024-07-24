from django.db.models import Prefetch
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import serializers
from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ReadOnlyModelViewSet
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

from eli_app.models import Act, ActStatus, Keyword, Publisher


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
    
    
from rest_framework.response import Response

class KeywordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Keyword
        fields = [
            "name",
        ]

from rest_framework.response import Response
from django.db.models import Count

class KeywordViewSet(ReadOnlyModelViewSet):
    queryset = Keyword.objects.annotate(act_count=Count('act')).filter(act_count__gt=0)
    serializer_class = KeywordSerializer
    pagination_class = None
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        names = [keyword['name'] for keyword in serializer.data]
        return Response(names)
    
    
    
    
class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Publisher
        fields = [
            "name",
        ]

class PublisherViewSet(ReadOnlyModelViewSet):
    queryset = Publisher.objects.annotate(act_count=Count('act')).filter(act_count__gt=0)
    serializer_class = PublisherSerializer
    pagination_class = None
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
    ]

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        names = [publisher['name'] for publisher in serializer.data]
        return Response(names)