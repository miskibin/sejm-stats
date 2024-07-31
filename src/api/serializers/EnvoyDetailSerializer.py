from django.conf import settings
from rest_framework import serializers
from sejm_app.models import Envoy, Voting, CommitteeMember, VoteOption
from collections import defaultdict
from django.db.models import Prefetch


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

    def get_envoy_vote(self, obj: Voting):
        envoy = self.context.get("envoy")
        if envoy:
            vote = next((v for v in obj.votes.all() if v.MP_id == envoy.id), None)
            return (
                VoteOption(vote.vote).label if vote and vote.vote is not None else None
            )
        return None


class EnvoyDetailSerializer(serializers.ModelSerializer):
    club_photo = serializers.SerializerMethodField()
    photo = serializers.SerializerMethodField()
    latest_votings = serializers.SerializerMethodField()
    discipline_ratio = serializers.SerializerMethodField()
    committee_memberships = serializers.SerializerMethodField()
    activity_percentage = serializers.SerializerMethodField()
    interpellations = serializers.SerializerMethodField()
    processes = serializers.SerializerMethodField()

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
            "title",
            "full_name",
            "photo",
            "club_photo",
            "latest_votings",
            "discipline_ratio",
            "committee_memberships",
            "activity_percentage",
            "interpellations",
            "processes",
        ]

    @staticmethod
    def setup_eager_loading(queryset):
        return queryset.prefetch_related(
            "club",
            "votes__voting",
            Prefetch(
                "committeemember_set",
                queryset=CommitteeMember.objects.select_related("committee"),
            ),
            Prefetch("interpellations", to_attr="prefetched_interpellations"),
            Prefetch("processes", to_attr="prefetched_processes"),
        ).select_related("club")

    def get_club_photo(self, obj):
        return obj.club.photo.url if obj.club and obj.club.photo else None

    def get_photo(self, obj):
        return obj.photo.url if obj.photo else None

    def get_latest_votings(self, obj):
        votes = obj.votes.all()[:5]
        votings = (
            Voting.objects.filter(votes__in=votes).distinct().order_by("-date")[:5]
        )
        return EnvoyVotingSerializer(votings, many=True, context={"envoy": obj}).data

    def get_discipline_ratio(self, obj):
        votes = obj.votes.all()[:100]  # Limit to last 100 votes for performance
        voting_dict = defaultdict(int)

        for vote in votes:
            voting = vote.voting
            try:
                club_vote = voting.club_votes.get(club=obj.club)
                most_popular = (
                    VoteOption.NO if club_vote.no > club_vote.yes else VoteOption.YES
                )

                if vote.vote in [
                    VoteOption.ABSENT,
                    VoteOption.VOTE_VALID,
                    VoteOption.ABSTAIN,
                ]:
                    voting_dict["brak głosu"] += 1
                elif most_popular == vote.vote:
                    voting_dict["zgodnie"] += 1
                else:
                    voting_dict["niezgodnie"] += 1
            except Exception:
                continue

        return {
            "labels": list(voting_dict.keys()),
            "values": list(voting_dict.values()),
        }

    def get_committee_memberships(self, obj):
        return CommitteeMembershipSerializer(
            obj.committeemember_set.all(), many=True
        ).data

    def get_activity_percentage(self, obj):
        return int(obj.total_activity / 2.75)

    def get_interpellations(self, obj):
        from api.serializers.detail_serializers import InterpellationSerializer

        return InterpellationSerializer(
            obj.prefetched_interpellations[:5], many=True
        ).data

    def get_processes(self, obj):
        from api.serializers.list_serializers import ProcessListSerializer

        return ProcessListSerializer(obj.prefetched_processes[:5], many=True).data
