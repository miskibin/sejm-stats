from django.db.models import Q, F, FloatField
from django.db.models.functions import Cast, Log
from api.serializers.list_serializers import ActListSerializer
from eli_app.libs.embede import embed_text
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pgvector.django import CosineDistance
from django.apps import apps
from loguru import logger


class VectorSearchView(APIView):
    def get(self, request):
        query = request.GET.get("q")
        n = int(request.GET.get("n", 10))
        min_length = int(request.GET.get("min_length", 0))

        if not query:
            return Response(
                {"error": "Query parameter 'q' is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        Act = apps.get_model("eli_app", "Act")
        query_embedding = embed_text(query)[0]
        logger.debug(f"total acts {Act.objects.count()}")
        # First try without normalization to check if basic search works
        base_query = Act.objects.annotate(
            cosine_dist=CosineDistance("embedding", query_embedding)
        )

        # logger.debug first few results to debug
        debug_results = base_query.order_by("cosine_dist")[:5]
        # Try with modified normalization
        similar_acts = (
            Act.objects.annotate(
                cosine_dist=CosineDistance("embedding", query_embedding),
                # Try log normalization to handle varying text lengths better
                normalized_score=(-1 * F("cosine_dist"))
                * Log(Cast("text_length", FloatField())),
            )
            .filter(
                text_length__gte=min_length,
                # Add maximum distance threshold
                cosine_dist__lte=1.0,  # Adjust this threshold as needed
            )
            .order_by("-normalized_score")[:n]
        )

        logger.debug("Debug - result count:", similar_acts.count())
        logger.debug("Debug - SQL:", similar_acts.query)

        serializer = ActListSerializer(similar_acts, many=True)
        return Response(
            {
                "results": serializer.data,
                "count": len(serializer.data),
                # Add debug info in development
                "debug": {
                    "min_length": min_length,
                    "query_length": len(query),
                    "embedding_size": len(query_embedding),
                },
            }
        )
