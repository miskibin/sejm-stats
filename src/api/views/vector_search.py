from datetime import datetime
from django.db.models import F
from django.core.cache import cache
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from loguru import logger
from pgvector.django import CosineDistance
from functools import lru_cache
import numpy as np

from eli_app.libs.run_llms import embed_text
from eli_app.models import ActSection
from rest_framework import serializers


class ActSectionSerializer(serializers.ModelSerializer):
    act_url = serializers.SerializerMethodField()
    act_title = serializers.CharField(source="act.title")
    act_announcement_date = serializers.SerializerMethodField()
    similarity_score = serializers.FloatField()

    class Meta:
        model = ActSection
        fields = [
            "act_url",
            "act_title",
            "summary",
            "content",
            "chapters",
            "act_announcement_date",
            "similarity_score",
        ]

    def get_act_url(self, obj: ActSection):
        return obj.act.url

    def get_act_announcement_date(self, obj: ActSection):
        return str(obj.act.announcementDate)


class VectorSearchView(APIView):
    CACHE_TIMEOUT = 3600
    MIN_CONTENT_LENGTH = 100

    @lru_cache(maxsize=1000)
    def get_embedding(self, query: str):
        embedding = embed_text(texts=[query])[0]
        # Convert numpy array to list for database compatibility
        return embedding.tolist() if isinstance(embedding, np.ndarray) else embedding

    def get(self, request):
        try:
            query = request.GET.get("q")
            if not query:
                return Response([], status=status.HTTP_400_BAD_REQUEST)

            n = int(request.GET.get("n", 4))
            # Fetch more results initially to account for filtering
            search_limit = n * 2

            cache_key = f"embedding:{query}"
            query_embedding = cache.get(cache_key)

            if not query_embedding:
                try:
                    query_embedding = self.get_embedding(query)
                    cache.set(cache_key, query_embedding, self.CACHE_TIMEOUT)
                except Exception as e:
                    logger.error(f"Error generating embedding: {str(e)}")
                    return Response([], status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Only filter for non-null embeddings in database query
            filters = {"embedding__isnull": False}

            similar_sections = (
                ActSection.objects.filter(**filters)
                .annotate(
                    similarity_score=1 - CosineDistance("embedding", query_embedding),
                )
                .order_by("-similarity_score")[:search_limit]
            )

            # Post-process to filter by content length
            filtered_sections = [
                section
                for section in similar_sections
                if len(section.content) >= self.MIN_CONTENT_LENGTH
            ][:n]

            serializer = ActSectionSerializer(filtered_sections, many=True)
            return Response(serializer.data)

        except Exception as e:
            logger.error(f"Error in vector search: {str(e)}")
            return Response([], status=status.HTTP_500_INTERNAL_SERVER_ERROR)
