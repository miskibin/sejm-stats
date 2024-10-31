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

from eli_app.libs.embede import embed_text


class VectorSearchView(APIView):
    DEFAULT_BOOST = 0.3
    DEFAULT_PUBLISHER = "DU"
    DEFAULT_STATUS = "obowiązujący"
    CACHE_TIMEOUT = 3600

    @lru_cache(maxsize=1000)
    def get_embedding(self, query: str):
        embedding = embed_text(texts=[query])[0]
        # Convert numpy array to list for database compatibility
        return embedding.tolist() if isinstance(embedding, np.ndarray) else embedding

    def build_filters(
        self, publishers: Optional[str] = None, statuses: Optional[str] = None
    ):
        filters = {}
        if publishers:
            filters["publisher__code__in"] = publishers.split(",")
        else:
            filters["publisher__code"] = self.DEFAULT_PUBLISHER
        if statuses:
            filters["status__name__in"] = statuses.split(",")
        else:
            filters["status__name"] = self.DEFAULT_STATUS
        return filters

    def get(self, request):
        try:
            query = request.GET.get("q")
            if not query:
                return Response([], status=status.HTTP_400_BAD_REQUEST)

            n = int(request.GET.get("n", 4))
            initial_fetch = int(request.GET.get("initial_fetch", 20))
            unified_text_boost = float(
                request.GET.get("wzmocnienie_dla_aktow_jednolitych", self.DEFAULT_BOOST)
            )
            publishers = request.GET.get("publishers")
            statuses = request.GET.get("statuses")

            Act = apps.get_model("eli_app", "Act")

            cache_key = f"embedding:{query}"
            query_embedding = cache.get(cache_key)

            if not query_embedding:
                try:
                    query_embedding = self.get_embedding(query)
                    cache.set(cache_key, query_embedding, self.CACHE_TIMEOUT)
                except Exception as e:
                    logger.error(f"Error generating embedding: {str(e)}")
                    return Response([], status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            filters = self.build_filters(publishers, statuses)

            # Add embedding not null filter
            filters["embedding__isnull"] = False

            initial_results = (
                Act.objects.filter(**filters)
                .select_related("publisher", "status")
                .annotate(
                    distance=CosineDistance("embedding", query_embedding),
                )
                .order_by("distance")[:initial_fetch]
            )

            similar_acts = (
                Act.objects.filter(ELI__in=[act.ELI for act in initial_results])
                .select_related("publisher", "status")
                .prefetch_related("keywords")
                .annotate(
                    distance=CosineDistance("embedding", query_embedding),
                    text_boost=Case(
                        When(
                            title__icontains="ogłoszenia jednolitego tekstu",
                            then=Value(unified_text_boost),
                        ),
                        default=Value(0.0),
                        output_field=FloatField(),
                    ),
                    adjusted_distance=F("distance") - F("text_boost"),
                )
                .order_by("adjusted_distance")[:n]
            )

            serializer = ActListSerializer(similar_acts, many=True)
            return Response(serializer.data)

        except Exception as e:
            logger.error(f"Error in vector search: {str(e)}")
            return Response([], status=status.HTTP_500_INTERNAL_SERVER_ERROR)