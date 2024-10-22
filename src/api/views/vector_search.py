from django.db.models import Q, F, FloatField, Value
from django.db.models.functions import Cast, Log, Greatest
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
        max_distance = float(
            request.GET.get("max_distance", 0.8)
        )  # Add distance threshold

        if not query:
            return Response(
                {"error": "Query parameter 'q' is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        Act = apps.get_model("eli_app", "Act")

        try:
            query_embedding = embed_text(query)[0]
        except Exception as e:
            logger.exception("Error generating query embedding")
            return Response(
                {"error": "Failed to generate embedding for query"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Debug info gathering
        total_acts = Act.objects.count()
        total_with_embeddings = Act.objects.filter(embedding__isnull=False).count()
        logger.debug(
            f"Total acts: {total_acts}, with embeddings: {total_with_embeddings}"
        )

        try:
            # Build the query in steps for better debugging
            base_query = Act.objects.filter(
                embedding__isnull=False, text_length__gte=min_length
            )

            # Add distance calculation
            with_distance = base_query.annotate(
                cosine_dist=CosineDistance("embedding", query_embedding),
            )

            # Add scoring components
            with_scoring = with_distance.annotate(
                # Ensure we don't take log of zero
                safe_length=Greatest(
                    F("text_length"), Value(1.0), output_field=FloatField()
                ),
                length_factor=Log(F("safe_length"), Value(2.0)),
                # Normalize distance to 0-1 range and combine with length
                similarity_score=Value(1.0) - F("cosine_dist"),
                normalized_score=(F("similarity_score") * F("length_factor")),
            )

            # Apply distance threshold and get results
            similar_acts = with_scoring.filter(cosine_dist__lte=max_distance).order_by(
                "-normalized_score"
            )[:n]

            # Get detailed debug info for first few results
            sample_results = list(similar_acts[:5])
            debug_samples = []
            for act in sample_results:
                debug_info = {
                    "id": act.id,
                    "distance": float(act.cosine_dist),
                    "score": float(act.normalized_score),
                    "length": act.text_length,
                    "title": str(act.title)[:50],  # Add title for easier debugging
                }
                debug_samples.append(debug_info)
                logger.debug(f"Result details: {debug_info}")

            serializer = ActListSerializer(similar_acts, many=True)

            return Response(
                {
                    "results": serializer.data,
                    "count": len(serializer.data),
                    "debug": {
                        "min_length": min_length,
                        "max_distance": max_distance,
                        "query_length": len(query),
                        "embedding_size": len(query_embedding),
                        "total_acts": total_acts,
                        "acts_with_embeddings": total_with_embeddings,
                        "sample_scores": debug_samples,
                    },
                }
            )

        except Exception as e:
            logger.exception("Error in vector search")
            return Response(
                {
                    "error": str(e),
                    "detail": str(e.__class__.__name__),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
