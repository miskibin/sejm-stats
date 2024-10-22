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
        max_distance = float(request.GET.get("max_distance", 0.8))

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

        try:
            # Filter acts and calculate similarity scores
            similar_acts = (
                Act.objects.filter(embedding__isnull=False, text_length__gte=min_length)
                .annotate(
                    cosine_dist=CosineDistance("embedding", query_embedding),
                    safe_length=Greatest(
                        F("text_length"), Value(1.0), output_field=FloatField()
                    ),
                    length_factor=Log(F("safe_length"), Value(2.0)),
                    similarity_score=Value(1.0) - F("cosine_dist"),
                    normalized_score=(F("similarity_score") * F("length_factor")),
                )
                .filter(cosine_dist__lte=max_distance)
                .order_by("-normalized_score")[:n]
            )

            serializer = ActListSerializer(similar_acts, many=True)
            return Response({"results": serializer.data, "count": len(serializer.data)})

        except Exception as e:
            logger.exception("Error in vector search")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
