from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework import serializers

from sejm_app.models.interpellation import Interpellation


class InterpellationPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = "page_size"
    max_page_size = 100


class InterpellationSerializer(serializers.ModelSerializer):
    member = serializers.SerializerMethodField()

    def get_member(self, obj):
        return str(obj.fromMember)

    class Meta:
        model = Interpellation
        fields = [
            "id",
            "term",
            "num",
            "title",
            "receiptDate",
            "lastModified",
            "bodyLink",
            "member",
            "to",
            "sentDate",
            "repeatedInterpellation",
        ]


class InterpellationViewSet(ReadOnlyModelViewSet):
    pagination_class = InterpellationPagination
    queryset = Interpellation.objects.all()
    serializer_class = InterpellationSerializer
