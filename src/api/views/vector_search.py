from django.db.models import F
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
            # Make sure we get a vector of the right dimension
            query_embedding = embed_text(query)[0]
        except Exception as e:
            logger.exception("Error generating query embedding")
            return Response(
                {"error": "Failed to generate embedding for query"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            similar_acts = (
                Act.objects.filter(embedding__isnull=False, text_length__gte=min_length)
                .annotate(distance=CosineDistance("embedding", query_embedding))
                .filter(distance__lte=max_distance)
                .order_by("distance")[:n]
            )

            # Serialize the acts
            serialized_acts = ActListSerializer(similar_acts, many=True).data

            # Add distance to each result
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
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
