from django.utils import timezone
from django.utils.formats import date_format
from rest_framework import serializers

from community_app.models import TeamMember
from eli_app.models import Act
from sejm_app.models import (Club, Committee, Envoy, Interpellation, Process,
                             Voting)
from sejm_app.models.committee import CommitteeType
from sejm_app.models.faq import FAQ
from sejm_app.models.print_model import PrintModel


class VotingListSerializer(serializers.ModelSerializer):
    category = serializers.SerializerMethodField()
    kind = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()

    class Meta:
        model = Voting
        fields = [
            "id",
            "category",
            "sitting",
            "date",
            "title",
            "description",
            "topic",
            "kind",
            "success",
        ]

    def get_category(self, obj):
        return obj.get_category_display()

    def get_kind(self, obj):
        return obj.get_kind_display()

    def get_date(self, obj: Voting):
        if obj.date:
            return date_format(timezone.localtime(obj.date), format="Y-m-d")
        return None


class ProcessListSerializer(serializers.ModelSerializer):
    # createdBy = serializers.CharField(source="get_createdBy_display")
    documentDate = serializers.SerializerMethodField()

    class Meta:
        model = Process
        fields = [
            "id",
            "number",
            "createdBy",
            "documentDate",
            "title",
            "createdBy",
            "length_tag",
        ]

    def get_documentDate(self, obj):
        return (
            date_format(obj.documentDate, format="Y-m-d") if obj.documentDate else None
        )


class InterpellationListSerializer(serializers.ModelSerializer):
    member = serializers.SerializerMethodField()
    to = serializers.SerializerMethodField()

    def get_member(self, obj):
        return str(obj.fromMember)

    def get_to(self, obj):
        return str((obj.to)[0])

    class Meta:
        model = Interpellation
        fields = [
            "id",
            "title",
            "receiptDate",
            "bodyLink",
            "member",
            "to",
            "sentDate",
        ]


class PrintListSerializer(serializers.ModelSerializer):
    pdf_url = serializers.SerializerMethodField()

    class Meta:
        model = PrintModel
        fields = ["id", "title", "pdf_url"]

    def get_pdf_url(self, obj):
        return obj.pdf_url


class ClubListSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = Club
        fields = ["id", "name", "phone", "fax", "email", "membersCount", "photo_url"]

    def get_photo_url(self, obj):
        return obj.photo.url if obj.photo else None


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ["id", "question", "answer", "url1", "url2"]


class TeamMemberSerializer(serializers.ModelSerializer):
    role = serializers.CharField(source="get_role_display")

    class Meta:
        model = TeamMember
        fields = [
            "id",
            "name",
            "role",
            "since",
            "facebook_url",
            "about",
            "photo",
        ]


class CommitteeListSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    compositionDate = serializers.SerializerMethodField()

    class Meta:
        model = Committee
        fields = [
            "name",
            "nameGenitive",
            "code",
            "compositionDate",
            "scope",
            "type",
        ]

    def get_type(self, obj):
        return CommitteeType(obj.type).label

    def get_compositionDate(self, obj):
        return obj.friendlyCompositionDate


class EnvoyListSerializer(serializers.ModelSerializer):
    club_photo = serializers.SerializerMethodField()
    photo = serializers.SerializerMethodField()

    class Meta:
        model = Envoy
        fields = [
            "id",
            "firstName",
            "lastName",
            "educationLevel",
            "numberOfVotes",
            "photo",
            "active",
            "club",
            "club_photo",
        ]

    def get_club_photo(self, obj):
        return obj.club.photo.url if obj.club.photo else None

    def get_photo(self, obj):
        return obj.photo.url if obj.photo else None


class ActListSerializer(serializers.ModelSerializer):
    publisher = serializers.CharField(source="publisher.name")
    status = serializers.CharField(source="status.name")
    releasedBy = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()

    class Meta:
        model = Act
        fields = [
            "ELI",
            "url",
            "publisher",
            "status",
            "title",
            "releasedBy",
            "announcementDate",
            "entryIntoForce",
        ]

    def get_url(self, obj):
        return obj.url

    def get_releasedBy(self, obj):
        return obj.releasedBy.name if obj.releasedBy else None


class ArticleContextSerializer(serializers.Serializer):
    envoys = serializers.SerializerMethodField()
    clubs = serializers.SerializerMethodField()
    committees = serializers.SerializerMethodField()
    votings = serializers.SerializerMethodField()
    processes = serializers.SerializerMethodField()
    interpellations = serializers.SerializerMethodField()

    def get_envoys(self, obj):
        return [str(envoy) for envoy in Envoy.objects.all()]

    def get_clubs(self, obj):
        return [club.id for club in Club.objects.all()]

    def get_committees(self, obj):
        return [committee.code for committee in Committee.objects.all()]

    def get_votings(self, obj):
        return [voting.title for voting in Voting.objects.order_by("-date")[:100]]

    def get_processes(self, obj):
        return [
            process.title for process in Process.objects.order_by("-documentDate")[:100]
        ]

    def get_interpellations(self, obj):
        return [
            interpellation.title
            for interpellation in Interpellation.objects.order_by("-receiptDate")[:100]
        ]
