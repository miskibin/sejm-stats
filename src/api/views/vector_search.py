from django.db.models import F
from api.serializers.list_serializers import ActListSerializer
from eli_app.libs.embede import embed_text
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.apps import apps
from loguru import logger
from pgvector.django import CosineDistance
import time


class VectorSearchView(APIView):
    def get(self, request):
        start_time = time.time()

        query = request.GET.get("q")
        n = int(request.GET.get("n", 10))

        if not query:
            return Response(
                {"error": "Query parameter 'q' is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        Act = apps.get_model("eli_app", "Act")

        # Time the embedding generation
        embed_start = time.time()
        query_embedding = embed_text([query])[0]  # Extract first row
        embed_time = time.time() - embed_start

        logger.info(
            f"query: {query}, embedding_size: {len(query_embedding)}, embedding_time: {embed_time:.3f}s"
        )

        # Time the database search
        search_start = time.time()
        similar_acts = Act.objects.annotate(
            distance=CosineDistance("embedding", query_embedding)
        ).order_by("distance")[:n]

        # Serialize the results
        serializer = ActListSerializer(similar_acts, many=True)
        search_time = time.time() - search_start

        # Add similarity scores to the serialized data
        serialized_data = serializer.data
        for act, data in zip(similar_acts, serialized_data):
            # Convert distance to similarity (cosine distance = 1 - cosine similarity)
            data["similarity"] = float(1 - act.distance)

        total_time = time.time() - start_time
        logger.debug(f"search_time: {search_time:.3f}s, total_time: {total_time:.3f}s")

        return Response({"results": serialized_data, "count": len(serialized_data)})
