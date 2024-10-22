from django.db.models import F
from api.serializers.list_serializers import ActListSerializer
from eli_app.libs.embede import embed_text
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.apps import apps
from loguru import logger
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity


class VectorSearchView(APIView):
    def get(self, request):
        query = request.GET.get("q")
        n = int(request.GET.get("n", 10))

        if not query:
            return Response(
                {"error": "Query parameter 'q' is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        Act = apps.get_model("eli_app", "Act")

        try:
            # Get query embedding
            query_embedding = embed_text(query)[0]
            query_embedding = np.array(query_embedding).reshape(
                1, -1
            )  # Reshape for sklearn

            # Get all acts with embeddings
            acts_with_embeddings = Act.objects.filter(embedding__isnull=False)

            # Extract embeddings and convert to numpy array
            act_embeddings = []
            valid_acts = []

            for act in acts_with_embeddings:
                if act.embedding is not None and len(act.title) > 200:
                    act_embeddings.append(act.embedding)
                    valid_acts.append(act)

            if not act_embeddings:
                return Response({"results": [], "count": 0})

            # Convert to numpy array
            act_embeddings = np.array(act_embeddings)

            # Calculate cosine similarities
            similarities = cosine_similarity(query_embedding, act_embeddings)[0]

            # Create list of (act, similarity) tuples and sort
            act_similarities = list(zip(valid_acts, similarities))
            act_similarities.sort(key=lambda x: x[1], reverse=True)

            # Take top n results
            top_results = act_similarities[:n]

            # Serialize acts
            serialized_acts = ActListSerializer(
                [act for act, _ in top_results], many=True
            ).data

            # Add similarity scores to results
            for serialized_act, (_, similarity) in zip(serialized_acts, top_results):
                serialized_act["similarity"] = round(float(similarity), 3)

            return Response({"results": serialized_acts, "count": len(serialized_acts)})

        except Exception as e:
            logger.exception("Error in vector search")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
