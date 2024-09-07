from django.db.models import BooleanField, Case, Q, When
from django.utils.formats import date_format
from rest_framework import serializers

from api.serializers.list_serializers import (ClubListSerializer,
                                              EnvoyListSerializer,
                                              PrintListSerializer,
                                              VotingListSerializer)
from sejm_app.models import PrintModel, Process
from sejm_app.models.stage import Stage


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
