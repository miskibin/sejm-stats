from multiprocessing import Process

from rest_framework import serializers

from eli_app.models import Act
from sejm_app.models.committee import CommitteeSitting
from sejm_app.models.envoy import Envoy
from sejm_app.models.interpellation import Interpellation, Reply
from sejm_app.models.print_model import PrintModel
from sejm_app.models.vote import Vote


class EnvoySerializer(serializers.ModelSerializer):

    class Meta:
        model = Envoy
        fields = ["firstName", "lastName"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return f"{representation['firstName']} {representation['lastName']}"


class VoteSerializer(serializers.ModelSerializer):
    MP = EnvoySerializer(read_only=True)
    vote = serializers.CharField(source="vote_label")

    class Meta:
        model = Vote
        fields = ["MP", "vote"]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return list(representation.values())


from rest_framework import serializers


class PrintSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrintModel
        fields = ("number", "pdf_url")


class CommitteeSittingSerializer(serializers.ModelSerializer):
    # committee = serializers.StringRelatedField(source="committee.name")
    prints = PrintSerializer(many=True, read_only=True)
    committee = serializers.SerializerMethodField()

    def get_committee(self, obj):
        name = obj.committee.name
        if len(name.split()) < 7:
            return name
        return obj.committee.code

    class Meta:
        model = CommitteeSitting
        fields = (
            "id",
            "agenda",
            "date",
            "committee",
            "pdf_transcript",
            "prints",
            "video_url",
        )


class ReplySerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()

    class Meta:
        model = Reply
        fields = ("author", "receiptDate", "bodyLink")

    def get_author(self, obj):
        author = obj.author
        return (
            f"{author.firstName} {author.lastName}"
            if isinstance(author, Envoy)
            else author
        )


class EnvoyWithPhotoSerializer(serializers.ModelSerializer):
    photoUrl = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = Envoy
        fields = ("photoUrl", "name")

    def get_photoUrl(self, obj):
        return obj.photo.url

    def get_name(self, obj):
        return f"{obj.firstName} {obj.lastName}"


class InterpellationSerializer(serializers.ModelSerializer):
    fromMember = EnvoyWithPhotoSerializer(read_only=True)
    replies = ReplySerializer(many=True, read_only=True)

    class Meta:
        model = Interpellation
        fields = ("fromMember", "lastModified", "title", "bodyLink", "replies")


class ProcessSerializer(serializers.ModelSerializer):
    class Meta:
        model = Process
        fields = "__all__"


class PrintModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrintModel
        fields = ("title", "deliveryDate", "number", "pdf_url")


class ActSerializer(serializers.ModelSerializer):
    class Meta:
        model = Act
        fields = ("title", "ELI", "announcementDate", "url")
