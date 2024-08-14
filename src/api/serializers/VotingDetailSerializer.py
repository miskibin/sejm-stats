from django.db import models
from django.db.models import (
    Case,
    Count,
    F,
    IntegerField,
    OuterRef,
    Prefetch,
    Q,
    Subquery,
    Value,
    When,
)
from django.db.models.functions import Concat
from rest_framework import serializers

from api.serializers.list_serializers import (
    PrintListSerializer,
    ProcessListSerializer,
    VotingListSerializer,
)
from sejm_app.models import Club, ClubVote, Envoy, Process, Vote, VoteOption, Voting


class ClubListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = ["id"]


class ClubVoteSerializer(serializers.ModelSerializer):
    club = ClubListSerializer()

    class Meta:
        model = ClubVote
        fields = ["club", "yes", "no", "abstain"]


class VoteSerializer(serializers.ModelSerializer):
    MP = serializers.StringRelatedField()
    vote = serializers.CharField(source="get_vote_display")

    class Meta:
        model = Vote
        fields = ["MP", "vote"]


class VotingDetailSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="get_category_display")
    kind = serializers.CharField(source="get_kind_display")
    prints = PrintListSerializer(many=True)
    votes = VoteSerializer(many=True)
    club_votes = ClubVoteSerializer(many=True)
    total_data = serializers.SerializerMethodField()
    total_labels = serializers.SerializerMethodField()
    sex_votes = serializers.SerializerMethodField()
    processes = serializers.SerializerMethodField()
    similar_votings = serializers.SerializerMethodField()
    summary = serializers.CharField()

    class Meta:
        model = Voting
        fields = [
            "id",
            "yes",
            "no",
            "abstain",
            "category",
            "term",
            "sitting",
            "sittingDay",
            "votingNumber",
            "date",
            "title",
            "description",
            "topic",
            "prints",
            "pdfLink",
            "kind",
            "success",
            "summary",
            "club_votes",
            "total_data",
            "total_labels",
            "sex_votes",
            "processes",
            "similar_votings",
            "votes",
        ]

    def get_total_data(self, obj: Voting):
        return [obj.yes, obj.no, 460 - obj.yes - obj.no]

    def get_total_labels(self, obj):
        return ["Za", "Przeciw", "Brak głosu"]

    def get_sex_votes(self, obj):
        return {
            "female": {
                "yes": obj.female_yes,
                "no": obj.female_no,
                "abstain": obj.female_abstain,
            },
            "male": {
                "yes": obj.male_yes,
                "no": obj.male_no,
                "abstain": obj.male_abstain,
            },
        }

    def get_processes(self, obj):
        processes = []
        for print_obj in obj.prints.all():
            if hasattr(print_obj, "related_processes"):
                if isinstance(print_obj.related_processes, (list, models.QuerySet)):
                    processes.extend(print_obj.related_processes)
                elif isinstance(print_obj.related_processes, Process):
                    processes.append(print_obj.related_processes)
        return ProcessListSerializer(processes, many=True).data

    def get_similar_votings(self, obj):
        similar_votings = []
        for print_obj in obj.prints.all():
            if hasattr(print_obj, "similar_votings"):
                similar_votings.extend(print_obj.similar_votings)
        return VotingListSerializer(similar_votings, many=True).data

    @classmethod
    def setup_eager_loading(cls, queryset):
        return queryset.prefetch_related(
            "prints",
            Prefetch("votes", queryset=Vote.objects.select_related("MP")),
            Prefetch(
                "club_votes",
                queryset=ClubVote.objects.select_related("club").filter(
                    club__membersCount__gt=4
                ),
                to_attr="filtered_club_votes",
            ),
            Prefetch(
                "prints__processPrint",
                queryset=Process.objects.all(),
                to_attr="related_processes",
            ),
            Prefetch(
                "prints__votings",
                queryset=Voting.objects.exclude(id=F("id")).order_by("-date"),
                to_attr="similar_votings",
            ),
        ).annotate(
            female_yes=Count(
                "votes", filter=Q(votes__MP__isFemale=True, votes__vote=VoteOption.YES)
            ),
            female_no=Count(
                "votes", filter=Q(votes__MP__isFemale=True, votes__vote=VoteOption.NO)
            ),
            female_abstain=Count(
                "votes",
                filter=Q(
                    votes__MP__isFemale=True,
                    votes__vote__in=[VoteOption.ABSTAIN, VoteOption.ABSENT],
                ),
            ),
            male_yes=Count(
                "votes", filter=Q(votes__MP__isFemale=False, votes__vote=VoteOption.YES)
            ),
            male_no=Count(
                "votes", filter=Q(votes__MP__isFemale=False, votes__vote=VoteOption.NO)
            ),
            male_abstain=Count(
                "votes",
                filter=Q(votes__MP__isFemale=False, votes__vote=VoteOption.ABSTAIN),
            ),
        )

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation["club_votes"] = ClubVoteSerializer(
            instance.filtered_club_votes, many=True
        ).data
        return representation
