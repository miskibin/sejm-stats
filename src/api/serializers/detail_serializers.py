from django.conf import settings
from django.db.models import IntegerField
from django.utils.formats import date_format
from rest_framework import serializers

from sejm_app.models import Voting
from sejm_app.models.committee import CommitteeMember
from sejm_app.models.faq import FAQ
from sejm_app.models.interpellation import Interpellation

from .list_serializers import ClubListSerializer


class InterpellationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interpellation
        fields = ["id", "title", "lastModified", "bodyLink"]
