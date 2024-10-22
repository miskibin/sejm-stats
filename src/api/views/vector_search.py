from django.db.models import Q, F, FloatField
from django.db.models.functions import Cast
from api.serializers.list_serializers import ActListSerializer
from eli_app.libs.embede import embed_text
from eli_app.models import Act
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pgvector.django import CosineDistance
from django.apps import apps


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
        similar_acts = (
            Act.objects.annotate(
                cosine_dist=CosineDistance("embedding", query_embedding),
                normalized_score=(-1 * F("cosine_dist"))
                * Cast("text_length", FloatField())
                / 1000.0,
            )
            .filter(text_length__gte=min_length)
            .order_by("-normalized_score")[:n]
        )

        serializer = ActListSerializer(similar_acts, many=True)
        return Response({"results": serializer.data, "count": len(serializer.data)})
