from django.db.models import Q
from api.serializers.list_serializers import ActListSerializer
from eli_app.libs.embede import embed_text
from eli_app.models import Act
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pgvector.django import CosineDistance


class VectorSearchView(APIView):
    def get(self, request):
        query = request.GET.get("q")
        n = int(request.GET.get("n", 10))

        if not query:
            return Response(
                {"error": "Query parameter 'q' is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Generate embedding for the query
        query_embedding = embed_text(query)[0]

        # Search for similar Acts
        similar_acts = Act.objects.order_by(
            CosineDistance("embedding", query_embedding)
        )[:n]

        # Serialize the results
        serializer = ActListSerializer(similar_acts, many=True)

        return Response({"results": serializer.data, "count": len(serializer.data)})
