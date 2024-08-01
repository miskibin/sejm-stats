from rest_framework import serializers
from django.utils.formats import date_format
from sejm_app.models import Voting
from sejm_app.models.committee import CommitteeMember
from sejm_app.models.faq import FAQ
from sejm_app.models.interpellation import Interpellation
from .list_serializers import (
    ClubListSerializer,
)
from rest_framework import serializers
from django.db.models import IntegerField
from sejm_app.models import Voting
from .list_serializers import ClubListSerializer
from rest_framework import serializers
from django.conf import settings


class InterpellationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interpellation
        fields = ["id", "title", "lastModified", "bodyLink"]

