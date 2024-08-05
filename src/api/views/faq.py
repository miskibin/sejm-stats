from rest_framework.pagination import PageNumberPagination
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework import serializers
from api.pagination import ApiViewPagination
from api.serializers import EnvoyDetailSerializer
from api.serializers.list_serializers import (
    EnvoyListSerializer,
    FAQSerializer,
    TeamMemberSerializer,
)
from community_app.models import TeamMember
from sejm_app.models.envoy import Envoy
from sejm_app.models.faq import FAQ
from rest_framework.response import Response


class FAQViewSet(ReadOnlyModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQSerializer

    def list(self, request, *args, **kwargs):
        faq_data = super().list(request, *args, **kwargs).data
        team_members = TeamMember.objects.all()
        team_members_data = TeamMemberSerializer(team_members, many=True).data

        return Response({"faqs": faq_data, "team_members": team_members_data})
