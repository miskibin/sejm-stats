


from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework import serializers
from api.pagination import ApiViewPagination
from api.serializers import EnvoyDetailSerializer
from api.serializers.list_serializers import EnvoyListSerializer, FAQSerializer
from sejm_app.models.envoy import Envoy
from sejm_app.models.faq import FAQ


class FAQViewSet(ReadOnlyModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer