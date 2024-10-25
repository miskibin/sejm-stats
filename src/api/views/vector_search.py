from django.db.models import F
from api.serializers.list_serializers import ActListSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.apps import apps
from loguru import logger
from pgvector.django import CosineDistance
import time

from eli_app.libs.embede import embed_text


class VectorSearchView(APIView):
    def get(self, request):
        try:
            start_time = time.time()

            query = request.GET.get("q")
            n = int(request.GET.get("n", 10))

            if not query:
                return Response(
                    {
                        "error": "Query parameter 'q' is required",
                        "success": False,
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            Act = apps.get_model("eli_app", "Act")

            # Time the embedding generation
            embed_start = time.time()
            try:
                query_embedding = embed_text(texts=[query])[0]  # Extract first row
                embed_time = time.time() - embed_start

                logger.info(
                    f"query: {query}, embedding_size: {len(query_embedding)}, embedding_time: {embed_time:.3f}s"
                )
            except Exception as e:
                logger.error(f"Error generating embedding: {str(e)}")
                return Response(
                    {
                        "error": "Failed to generate embedding for query",
                        "details": str(e),
                        "success": False,
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )

            # Time the database search
            search_start = time.time()
            similar_acts = Act.objects.annotate(
                distance=CosineDistance("embedding", query_embedding)
            ).order_by("distance")[:n]

            # Serialize the results
            serializer = ActListSerializer(similar_acts, many=True)
            search_time = time.time() - search_start

            # Add similarity scores to the serialized data
            serialized_data = serializer.data
            for act, data in zip(similar_acts, serialized_data):
                # Handle null distance values and convert distance to similarity
                if act.distance is not None:
                    data["similarity"] = float(1 - act.distance)
                else:
                    data["similarity"] = None

            total_time = time.time() - start_time
            logger.debug(
                f"search_time: {search_time:.3f}s, total_time: {total_time:.3f}s"
            )

            return Response(
                {
                    "results": serialized_data,
                    "count": len(serialized_data),
                    "success": True,
                    "metadata": {
                        "search_time": f"{search_time:.3f}s",
                        "total_time": f"{total_time:.3f}s",
                        "embedding_time": f"{embed_time:.3f}s",
                    },
                }
            )

        except ValueError as e:
            # Handle invalid 'n' parameter
            return Response(
                {
                    "error": "Invalid parameter value",
                    "details": str(e),
                    "success": False,
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        except Exception as e:
            # Handle any other unexpected errors
            logger.error(f"Unexpected error in vector search: {str(e)}")
            return Response(
                {
                    "error": "An unexpected error occurred",
                    "details": str(e),
                    "success": False,
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
