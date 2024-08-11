from community_app.models import Article
from rest_framework import serializers


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ["id", "title", "content", "image", "created_at", "updated_at"]
        read_only_fields = ["created_at", "updated_at"]
