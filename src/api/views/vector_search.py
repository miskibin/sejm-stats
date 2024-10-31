from django.db.models import F, Case, When, Value, FloatField
from django.core.cache import cache
from api.serializers.list_serializers import ActListSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.apps import apps
from loguru import logger
from pgvector.django import CosineDistance
import time
from functools import lru_cache
from typing import List, Optional
import numpy as np

from eli_app.libs.run_llms import embed_text

from rest_framework import serializers

from eli_app.models import ActSection

class ActSectionSerializer(serializers.ModelSerializer):
    act_url = serializers.SerializerMethodField()
    act_title = serializers.CharField(source='act.title')

    class Meta:
        model = ActSection
        fields = ['act_url', 'act_title', 'summary', 'content', 'chapters']

    def get_act_url(self, obj: ActSection):
        return obj.act.url
    
    
class VectorSearchView(APIView):
    CACHE_TIMEOUT = 3600

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

            cache_key = f"embedding:{query}"
            query_embedding = cache.get(cache_key)

            if not query_embedding:
                try:
                    query_embedding = self.get_embedding(query)
                    cache.set(cache_key, query_embedding, self.CACHE_TIMEOUT)
                except Exception as e:
                    logger.error(f"Error generating embedding: {str(e)}")
                    return Response([], status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            # Add embedding not null filter
            filters = {"embedding__isnull": False}

            similar_sections = (
                ActSection.objects.filter(**filters)
                .annotate(
                    distance=CosineDistance("embedding", query_embedding),
                )
                .order_by("distance")[:n]
            )

            serializer = ActSectionSerializer(similar_sections, many=True)
            return Response(serializer.data)

        except Exception as e:
            logger.error(f"Error in vector search: {str(e)}")
            return Response([], status=status.HTTP_500_INTERNAL_SERVER_ERROR)