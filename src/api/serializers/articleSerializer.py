from rest_framework import serializers

from community_app.models import Article


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "content",
            "image",
            "created_at",
            "updated_at",
            "author",
        ]
        read_only_fields = ["created_at", "updated_at"]


class ArticleListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ["id", "title", "image", "created_at", "author"]
