from django.db.models import Q, F, ExpressionWrapper, FloatField
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

        # Calculate base similarity scores with length normalization
        similar_acts = (
            Act.objects.annotate(
                similarity=ExpressionWrapper(
                    1 - CosineDistance("embedding", query_embedding),
                    output_field=FloatField(),
                ),
                # Add a small constant (1.0) to ensure we don't multiply by zero
                # and to maintain a minimum score
                length_factor=ExpressionWrapper(
                    (F("text_length") / 500.0) + 1.0, output_field=FloatField()
                ),
            )
            .annotate(
                # Combine similarity with length factor
                adjusted_score=ExpressionWrapper(
                    F("similarity") * F("length_factor"), output_field=FloatField()
                )
            )
            .order_by("-adjusted_score")[:n]
        )

        # Include scores in response for debugging
        serializer = ActListSerializer(similar_acts, many=True)
        results = []

        for act, score_data in zip(
            serializer.data,
            similar_acts.values("similarity", "adjusted_score", "text_length"),
        ):
            results.append(
                {
                    **act,
                    "similarity": round(score_data["similarity"], 4),
                    "adjusted_score": round(score_data["adjusted_score"], 4),
                    "text_length": score_data["text_length"],
                }
            )

        return Response({"results": results, "count": len(results)})
