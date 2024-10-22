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

        if not query:
            return Response(
                {"error": "Query parameter 'q' is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        Act = apps.get_model("eli_app", "Act")

        try:
            query_embedding = embed_text(query)[0]

            similar_acts = (
                Act.objects.filter(embedding__isnull=False, text_length__gte=min_length)
                .annotate(
                    distance=CosineDistance("embedding", query_embedding),
                    similarity=(1 - F("distance")),
                )
                .filter(distance__lte=1.0)
                .order_by("-similarity")[:n]
            )

            serialized_acts = ActListSerializer(similar_acts, many=True).data

            # Add similarity scores to results
            for act, serialized_act in zip(similar_acts, serialized_acts):
                serialized_act["similarity"] = round(float(act.similarity), 2)

            return Response({"results": serialized_acts, "count": len(serialized_acts)})

        except Exception as e:
            logger.exception("Error in vector search")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
