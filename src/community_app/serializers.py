from django.template.defaultfilters import truncatechars
from rest_framework import serializers
from django.core.files.base import ContentFile
import base64
import uuid
from community_app.models import Article
from sejm_app.utils import format_human_friendly_date


class ArticleSerializer(serializers.ModelSerializer):
    image = serializers.CharField(required=False, allow_null=True)

    class Meta:
        model = Article
        fields = ["title", "content", "image"]

    def create(self, validated_data):
        image_data = validated_data.pop("image", None)
        article = Article.objects.create(**validated_data)

        if image_data:
            format, imgstr = image_data.split(";base64,")
            ext = format.split("/")[-1]
            data = ContentFile(base64.b64decode(imgstr), name=f"{uuid.uuid4()}.{ext}")
            article.image.save(data.name, data, save=True)
        return article
