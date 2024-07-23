from django.template.defaultfilters import truncatechars
from rest_framework import serializers

from sejm_app.utils import format_human_friendly_date

from .models import Article


class ArticleSerializer(serializers.ModelSerializer):
    text = serializers.SerializerMethodField()
    truncated_text = serializers.SerializerMethodField()
    url = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            "title",
            "text",
            "truncated_text",
            "created_at",
            "url",
            "category",
            "image_url",
            "author",
        ]

    def get_category(self, obj):
        if obj.category:
            return obj.category.name
        return "Brak kategorii"

    def get_created_at(self, obj):
        return format_human_friendly_date(obj.created_at)

    def get_text(self, obj):
        return obj.content_to_text

    def get_truncated_text(self, obj):
        return truncatechars(obj.content_to_text, 200)

    def get_url(self, obj):
        return obj.get_absolute_url()

    def get_author(self, obj):
        return f"{obj.author.first_name} {obj.author.last_name}"
