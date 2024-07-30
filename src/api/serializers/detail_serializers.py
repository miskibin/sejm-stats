from rest_framework import serializers
from django.utils.formats import date_format
from sejm_app.models import Envoy, Stage, Voting
from sejm_app.models.committee import CommitteeMember
from sejm_app.models.interpellation import Interpellation
from sejm_app.models.vote import ClubVote
from .list_serializers import (
    ClubListSerializer,
    ProcessListSerializer,
)
from rest_framework import serializers
from django.db.models import IntegerField
from sejm_app.models import Voting, Vote, VoteOption
from .list_serializers import ClubListSerializer
from rest_framework import serializers
from django.conf import settings
from collections import defaultdict

colors = settings.COLORS


class CommitteeMembershipSerializer(serializers.ModelSerializer):
    committee_name = serializers.CharField(source="committee.name")
    committee_code = serializers.CharField(source="committee.code")

    class Meta:
        model = CommitteeMember
        fields = ["committee_name", "committee_code", "function"]


class EnvoyVotingSerializer(serializers.ModelSerializer):
    envoy_vote = serializers.SerializerMethodField()

    class Meta:
        model = Voting
        fields = ["id", "title", "date", "envoy_vote"]

    def get_envoy_vote(self, obj):
        envoy = self.context.get("envoy")
        if envoy:
            vote = obj.votes.filter(MP=envoy).last()
            return vote.vote_label if vote else None
        return None


class InterpellationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interpellation
        fields = ["id", "title", "lastModified", "bodyLink"]




class EnvoyDetailSerializer(serializers.ModelSerializer):
    club_photo = serializers.SerializerMethodField()
    photo = serializers.SerializerMethodField()
    latest_votings = serializers.SerializerMethodField()
    discipline_ratio = serializers.SerializerMethodField()
    committee_memberships = serializers.SerializerMethodField()
    activity_percentage = serializers.SerializerMethodField()
    interpellations = InterpellationSerializer(many=True, read_only=True)
    processes = ProcessListSerializer(many=True)

    class Meta:
        model = Envoy
        fields = [
            "id",
            "firstName",
            "secondName",
            "lastName",
            "email",
            "active",
            "inactiveCause",
            "waiverDesc",
            "districtNum",
            "districtName",
            "voivodeship",
            "club",
            "birthDate",
            "birthLocation",
            "profession",
            "educationLevel",
            "numberOfVotes",
            "biography",
            "biography_source",
            "isFemale",
            "total_activity",
            "processes",
            "title",
            "full_name",
            "photo",
            "club_photo",
            "latest_votings",
            "discipline_ratio",
            "committee_memberships",
            "activity_percentage",
            "interpellations",
        ]

    def get_club_photo(self, obj):
        return obj.club.photo.url if obj.club and obj.club.photo else None

    def get_photo(self, obj):
        return obj.photo.url if obj.photo else None

    def get_latest_votings(self, obj):
        votes = obj.votes.all()
        votings = (
            Voting.objects.filter(votes__in=votes).distinct().order_by("-date")[:5]
        )
        return EnvoyVotingSerializer(votings, many=True, context={"envoy": obj}).data

    def get_discipline_ratio(self, obj):
        votes = obj.votes.all()
        votings = Voting.objects.filter(votes__in=votes).distinct().order_by("-date")
        club = obj.club
        voting_dict = defaultdict(int)

        for voting in votings:
            try:
                club_vote = voting.club_votes.get(club=club)
                most_popular = (
                    VoteOption.NO if club_vote.no > club_vote.yes else VoteOption.YES
                )
                envoy_vote = obj.votes.get(voting=voting).vote

                if envoy_vote in [
                    VoteOption.ABSENT,
                    VoteOption.VOTE_VALID,
                    VoteOption.ABSTAIN,
                ]:
                    voting_dict["brak głosu"] += 1
                elif most_popular == envoy_vote:
                    voting_dict["zgodnie"] += 1
                else:
                    voting_dict["niezgodnie"] += 1
            except (ClubVote.MultipleObjectsReturned, ClubVote.DoesNotExist):
                continue

        return {
            "labels": list(voting_dict.keys()),
            "values": list(voting_dict.values()),
            "colors": [colors.SUCCESS, colors.WARNING, colors.DANGER],
        }

    def get_committee_memberships(self, obj):
        memberships = CommitteeMember.objects.filter(envoy=obj)
        return CommitteeMembershipSerializer(memberships, many=True).data

    def get_activity_percentage(self, obj):
        # TODO this is temp.
        # get max activity from all envoys
        # max_activity = max([envoy.total_activity for envoy in Envoy.objects.all()])
        # print(max_activity)
        return int(obj.total_activity / 2.75)
