from django.db.models import F
from api.serializers.list_serializers import ActListSerializer
from eli_app.libs.embede import embed_text
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.apps import apps
from loguru import logger
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np


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
            query_embedding = np.array(query_embedding).reshape(1, -1)
        except Exception as e:
            logger.exception("Error generating query embedding")
            return Response(
                {"error": "Failed to generate embedding for query"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        try:
            # Get eligible acts
            acts = Act.objects.filter(
                embedding__isnull=False, text_length__gte=min_length
            )

            if not acts:
                return Response({"results": [], "count": 0})

            # Get embeddings as numpy array
            embeddings = np.array([act.embedding for act in acts])

            # Calculate similarities
            similarities = cosine_similarity(query_embedding, embeddings)[0]

            # Convert similarities to distances (1 - similarity)
            distances = 1 - similarities

            # Filter by max distance

            if len(distances) == 0:
                return Response({"results": [], "count": 0})

            # Sort by distance and get top n
            sorted_indices = distances[np.argsort(distances[distances])][:n]

            # Get acts and their distances
            selected_acts = []
            acts_list = list(acts)

            for idx in sorted_indices:
                act_data = ActListSerializer(acts_list[idx]).data
                act_data["distance"] = float(distances[idx])
                selected_acts.append(act_data)

            return Response(
                {
                    "results": selected_acts,
                    "count": len(selected_acts),
                }
            )

        except Exception as e:
            logger.exception("Error in vector search")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
