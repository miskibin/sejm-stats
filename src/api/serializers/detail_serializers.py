from rest_framework import serializers
from django.utils.formats import date_format
from django.db.models import Q, Case, When, BooleanField
from sejm_app.models import Process, Club, Envoy, PrintModel, Stage, Voting
from sejm_app.models.committee import CommitteeMember
from sejm_app.models.interpellation import Interpellation
from sejm_app.models.vote import ClubVote
from .list_serializers import (
    PrintListSerializer,
    ClubListSerializer,
    EnvoyListSerializer,
    ProcessListSerializer,
    VotingListSerializer,
)
from rest_framework import serializers
from django.db.models import Count, Case, When, IntegerField, Q
from sejm_app.models import Voting, Vote, VoteOption, Process, PrintModel
from .list_serializers import PrintListSerializer, ClubListSerializer


class StageSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()
    voting = VotingListSerializer()

    class Meta:
        model = Stage
        fields = [
            "stageNumber",
            "date",
            "stageName",
            "sittingNum",
            "comment",
            "decision",
            "textAfter3",
            "voting",
            "result",
        ]

    def get_date(self, obj):
        return (
            date_format(obj.date, format="d E Y", use_l10n=True) if obj.date else None
        )


class ProcessDetailSerializer(serializers.ModelSerializer):
    UE = serializers.SerializerMethodField()
    createdBy = serializers.CharField(source="get_createdBy_display")
    documentDate = serializers.SerializerMethodField()
    processStartDate = serializers.SerializerMethodField()
    changeDate = serializers.SerializerMethodField()
    legislativeCommittee = serializers.SerializerMethodField()
    principleOfSubsidiarity = serializers.SerializerMethodField()
    urgencyStatus = serializers.SerializerMethodField()
    length_tag = serializers.SerializerMethodField()
    is_finished = serializers.SerializerMethodField()
    prints = serializers.SerializerMethodField()
    club = ClubListSerializer()
    MPs = EnvoyListSerializer(many=True)
    stages = StageSerializer(many=True)

    class Meta:
        model = Process
        fields = [
            "id",
            "UE",
            "comments",
            "number",
            "term",
            "changeDate",
            "description",
            "documentDate",
            "documentType",
            "legislativeCommittee",
            "principleOfSubsidiarity",
            "processStartDate",
            "rclNum",
            "title",
            "urgencyStatus",
            "createdBy",
            "pagesCount",
            "length_tag",
            "is_finished",
            "prints",
            "club",
            "MPs",
            "stages",
        ]

    def get_UE(self, obj):
        return "Tak" if obj.UE else "Nie"

    def get_documentDate(self, obj):
        return (
            date_format(obj.documentDate, format="d E Y", use_l10n=True)
            if obj.documentDate
            else None
        )

    def get_processStartDate(self, obj):
        return (
            date_format(obj.processStartDate, format="d E Y", use_l10n=True)
            if obj.processStartDate
            else None
        )

    def get_changeDate(self, obj):
        return (
            date_format(obj.changeDate, format="d E Y", use_l10n=True)
            if obj.changeDate
            else None
        )

    def get_legislativeCommittee(self, obj):
        return "Tak" if obj.legislativeCommittee else "Nie"

    def get_principleOfSubsidiarity(self, obj):
        return "Tak" if obj.principleOfSubsidiarity else "Nie"

    def get_urgencyStatus(self, obj):
        return obj.urgencyStatus

    def get_length_tag(self, obj):
        return obj.length_tag

    def get_is_finished(self, obj):
        return "Zakończony" if obj.is_finished else "W toku"

    def get_prints(self, obj):
        prints = (
            PrintModel.objects.filter(
                Q(processPrint__number=obj.number) | Q(number=obj.number)
            )
            .annotate(
                is_processPrint_null=Case(
                    When(processPrint__number=None, then=False),
                    default=True,
                    output_field=BooleanField(),
                )
            )
            .order_by("is_processPrint_null")
        )

        return PrintListSerializer(prints, many=True).data


class ClubVoteSerializer(serializers.ModelSerializer):
    club = ClubListSerializer()

    class Meta:
        model = ClubVote
        fields = ["club", "yes", "no", "abstain"]


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


class VotingSerializer(serializers.ModelSerializer):
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
        return VotingSerializer(votings, many=True, context={"envoy": obj}).data

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


class VoteSerializer(serializers.ModelSerializer):
    MP = serializers.SerializerMethodField()
    vote = serializers.CharField(source="get_vote_display")

    class Meta:
        model = Vote
        fields = ["MP", "vote"]

    def get_MP(self, obj):
        return str(obj.MP)


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

    def get_total_data(self, obj):
        return [
            obj.votes.filter(vote=VoteOption.YES).count(),
            obj.votes.filter(vote=VoteOption.NO).count(),
            obj.votes.filter(vote=VoteOption.ABSTAIN).count(),
        ]

    def get_total_labels(self, obj):
        return ["Za", "Przeciw", "Wstrzymał się"]

    def get_sex_votes(self, obj):
        male_votes = obj.votes.filter(MP__isFemale=False).aggregate(
            yes=Count(
                Case(When(vote=VoteOption.YES, then=1), output_field=IntegerField())
            ),
            no=Count(
                Case(When(vote=VoteOption.NO, then=1), output_field=IntegerField())
            ),
            abstain=Count(
                Case(When(vote=VoteOption.ABSTAIN, then=1), output_field=IntegerField())
            ),
        )

        female_votes = obj.votes.filter(MP__isFemale=True).aggregate(
            yes=Count(
                Case(When(vote=VoteOption.YES, then=1), output_field=IntegerField())
            ),
            no=Count(
                Case(When(vote=VoteOption.NO, then=1), output_field=IntegerField())
            ),
            abstain=Count(
                Case(When(vote=VoteOption.ABSTAIN, then=1), output_field=IntegerField())
            ),
        )

        return {"male": male_votes, "female": female_votes}

    def get_processes(self, obj):
        prints = obj.prints.filter(processPrint__isnull=True)
        processes = Process.objects.filter(Q(printModel__in=prints))
        return ProcessListSerializer(processes, many=True).data

    def get_similar_votings(self, obj):
        prints = obj.prints.filter(processPrint__isnull=True)
        similar_prints = prints.values_list("id", flat=True)
        similar_votings = (
            Voting.objects.filter(prints__in=similar_prints)
            .exclude(id=obj.id)
            .distinct()
        )
        return VotingListSerializer(similar_votings, many=True).data
