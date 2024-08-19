from collections import defaultdict

from django.db.models import Count, Q
from django.utils import timezone
from loguru import logger
from rest_framework import serializers

from sejm_app.models.club import Club
from sejm_app.models.committee import CommitteeMember, CommitteeSitting
from sejm_app.models.envoy import Envoy
from sejm_app.models.interpellation import Interpellation
from sejm_app.models.process import CreatedByEnum, Process


class TotalStatsSerializer(serializers.Serializer):
    total_envoys = serializers.IntegerField()
    club_stats = serializers.DictField(child=serializers.DictField())
    age_distribution = serializers.DictField(child=serializers.DictField())
    sex_distribution = serializers.DictField(child=serializers.DictField())
    district_distribution = serializers.DictField(child=serializers.DictField())
    interpellations_stats = serializers.DictField(child=serializers.DictField())
    committee_stats = serializers.DictField(child=serializers.DictField())
    top_committees = serializers.ListField(child=serializers.DictField())
    top_interpellation_recipients = serializers.ListField(child=serializers.DictField())
    process_stats = serializers.DictField(child=serializers.DictField())

    def get_envoy_stats(self):
        envoys = Envoy.objects.all().exclude(club__id="niez.")
        clubs = Club.objects.all().exclude(id="niez.")
        current_year = timezone.now().year

        club_stats = defaultdict(lambda: {"envoy_count": 0})
        age_distribution = defaultdict(lambda: defaultdict(int))
        sex_distribution = defaultdict(lambda: defaultdict(int))
        district_distribution = defaultdict(lambda: defaultdict(int))

        for envoy in envoys:
            club_id = envoy.club.id
            age = current_year - envoy.birthDate.year
            sex = "Female" if envoy.isFemale else "Male"

            club_stats[club_id]["envoy_count"] += 1
            club_stats["total"]["envoy_count"] += 1

            age_distribution[club_id][age] += 1
            age_distribution["total"][age] += 1

            sex_distribution[club_id][sex] += 1
            sex_distribution["total"][sex] += 1

            district_distribution[club_id][envoy.districtName] += 1
            district_distribution["total"][envoy.districtName] += 1

        return club_stats, age_distribution, sex_distribution, district_distribution

    def get_interpellation_stats(self):
        interpellations_stats = defaultdict(
            lambda: {"total": 0, "with_reply": 0, "with_no_reply": 0}
        )

        interpellations_by_club = Interpellation.objects.values(
            "fromMember__club__id"
        ).annotate(
            total=Count("id"),
            with_reply=Count("id", filter=Q(replies__isnull=False)),
            with_no_reply=Count("id", filter=Q(replies__isnull=True)),
        )

        for item in interpellations_by_club:
            club_id = item["fromMember__club__id"]
            interpellations_stats[club_id]["total"] = item["total"]
            interpellations_stats[club_id]["with_reply"] = item["with_reply"]
            interpellations_stats[club_id]["with_no_reply"] = item["with_no_reply"]

            interpellations_stats["total"]["total"] += item["total"]
            interpellations_stats["total"]["with_reply"] += item["with_reply"]
            interpellations_stats["total"]["with_no_reply"] += item["with_no_reply"]

        return interpellations_stats

    def get_committee_stats(self):
        committee_stats = defaultdict(
            lambda: {"membership_count": 0, "functions": defaultdict(int)}
        )

        memberships_by_club = CommitteeMember.objects.values(
            "envoy__club__id"
        ).annotate(count=Count("id"))

        functions_by_club = CommitteeMember.objects.values(
            "envoy__club__id", "function"
        ).annotate(count=Count("id"))

        for item in memberships_by_club:
            club_id = item["envoy__club__id"]
            committee_stats[club_id]["membership_count"] = item["count"]
            committee_stats["total"]["membership_count"] += item["count"]

        for item in functions_by_club:
            club_id = item["envoy__club__id"]
            function = item["function"]
            committee_stats[club_id]["functions"][function] = item["count"]
            committee_stats["total"]["functions"][function] += item["count"]

        return committee_stats

    def get_top_committees(self):
        top_committees = (
            CommitteeSitting.objects.values("committee__name")
            .annotate(sitting_count=Count("id"))
            .order_by("-sitting_count")[:4]
        )

        return [
            {"name": item["committee__name"], "sitting_count": item["sitting_count"]}
            for item in top_committees
        ]

    def get_top_interpellation_recipients(self):
        top_recipients = (
            Interpellation.objects.values("to")
            .annotate(count=Count("id"))
            .order_by("-count")[:6]
        )

        return [
            {"recipient": item["to"], "count": item["count"]} for item in top_recipients
        ]

    def get_process_stats(self):
        process_stats = defaultdict(lambda: {"process_count": 0})

        processes = Process.objects.filter(
            createdBy=CreatedByEnum.ENVOYS
        ).prefetch_related("MPs__club")
        for process in processes:
            clubs = set(mp.club.id for mp in process.MPs.all())
            for club_id in clubs:
                process_stats[club_id]["process_count"] += 1
                process_stats["total"]["process_count"] += 1
        return process_stats

    def to_representation(self, instance):
        logger.info("Generating total stats representation")

        club_stats, age_distribution, sex_distribution, district_distribution = (
            self.get_envoy_stats()
        )
        interpellations_stats = self.get_interpellation_stats()
        committee_stats = self.get_committee_stats()
        top_committees = self.get_top_committees()
        top_interpellation_recipients = self.get_top_interpellation_recipients()
        process_stats = self.get_process_stats()

        total_envoys = club_stats["total"]["envoy_count"]

        return {
            "total_envoys": total_envoys,
            "club_stats": dict(club_stats),
            "age_distribution": dict(age_distribution),
            "sex_distribution": dict(sex_distribution),
            "district_distribution": dict(district_distribution),
            "interpellations_stats": dict(interpellations_stats),
            "committee_stats": dict(committee_stats),
            "top_committees": top_committees,
            "top_interpellation_recipients": top_interpellation_recipients,
            "process_stats": dict(process_stats),
        }
