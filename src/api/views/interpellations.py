from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, serializers
from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ReadOnlyModelViewSet

from sejm_app.models.interpellation import Interpellation


class InterpellationPagination(PageNumberPagination):
    page_size = 3000
    page_size_query_param = "page_size"
    max_page_size = 5000


class InterpellationSerializer(serializers.ModelSerializer):
    member = serializers.SerializerMethodField()

    def get_member(self, obj):
        return str(obj.fromMember)

    class Meta:
        model = Interpellation
        fields = [
            "id",
            "title",
            "receiptDate",
            "lastModified",
            "bodyLink",
            "member",
            "to",
            "sentDate",
        ]


class InterpellationViewSet(ReadOnlyModelViewSet):
    queryset = Interpellation.objects.all()
    serializer_class = InterpellationSerializer
    pagination_class = InterpellationPagination

    ordering = ["-receiptDate"]  # Default to most recently received

    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(cache_page(60 * 60))  # Cache for 1 hour
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
