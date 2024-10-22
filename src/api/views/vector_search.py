from django.db.models import F
from api.serializers.list_serializers import ActListSerializer
from eli_app.libs.embede import embed_text
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pgvector.django import CosineDistance
from django.apps import apps
from loguru import logger
import numpy as np


class VectorSearchView(APIView):
    def get(self, request):
        query = request.GET.get("q")
        n = int(request.GET.get("n", 10))
        min_length = int(request.GET.get("min_length", 0))
        max_distance = float(request.GET.get("max_distance", 0.8))

        if not query:
            return Response(
                {"error": "Query parameter 'q' is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        Act = apps.get_model("eli_app", "Act")

        try:
            # Generate embedding and ensure it's in the correct format
            query_embedding = embed_text(query)[0]
            # Convert to numpy array and ensure float32 dtype
            query_embedding = np.array(query_embedding, dtype=np.float32)
            
            # Ensure the embedding is the correct shape
            if len(query_embedding.shape) == 1:
                query_embedding = query_embedding.reshape(1, -1)
        except Exception as e:
            logger.exception("Error generating query embedding")
            return Response(
                {"error": f"Failed to generate embedding for query: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            # Create the query with proper type casting
            similar_acts = (
                Act.objects.filter(embedding__isnull=False, text_length__gte=min_length)
                .annotate(
                    distance=CosineDistance("embedding", query_embedding.tolist())
                )
                .filter(distance__lte=max_distance)
                .order_by("distance")[:n]
            )

            # Serialize the acts
            serialized_acts = ActListSerializer(similar_acts, many=True).data

            # Add distance to each result, ensuring float conversion
            for act, serialized_act in zip(similar_acts, serialized_acts):
                serialized_act["distance"] = float(act.distance)

            return Response(
                {
                    "results": serialized_acts,
                    "count": len(serialized_acts),
                }
            )

        except Exception as e:
            logger.exception("Error in vector search")
            return Response(
                {"error": f"Vector search error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )