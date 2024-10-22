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

        total_acts = Act.objects.count()
        total_with_embeddings = Act.objects.filter(embedding__isnull=False).count()
        logger.debug(
            f"Total acts: {total_acts}, with embeddings: {total_with_embeddings}"
        )

        # Add filter for non-null embeddings and basic error checking
        similar_acts = (
            Act.objects.filter(embedding__isnull=False, text_length__gte=min_length)
            .annotate(
                cosine_dist=CosineDistance("embedding", query_embedding),
                normalized_score=(-1 * F("cosine_dist")) * Log(F("text_length")),
            )
            .filter(cosine_dist__lte=1.0)
            .order_by("-normalized_score")[:n]
        )

        try:
            result_count = similar_acts.count()
            logger.debug(f"Result count: {result_count}")
            logger.debug(f"Query SQL: {similar_acts.query}")

            # Get some sample scores for debugging
            sample_results = list(similar_acts[:5])
            for act in sample_results:
                logger.debug(
                    f"Act {act.id}: dist={act.cosine_dist}, score={act.normalized_score}, length={act.text_length}"
                )

            serializer = ActListSerializer(similar_acts, many=True)

            return Response(
                {
                    "results": serializer.data,
                    "count": len(serializer.data),
                    "debug": {
                        "min_length": min_length,
                        "query_length": len(query),
                        "embedding_size": len(query_embedding),
                        "total_acts": total_acts,
                        "acts_with_embeddings": total_with_embeddings,
                    },
                }
            )

        except Exception as e:
            logger.exception("Error in vector search")
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
