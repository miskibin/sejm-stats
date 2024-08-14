from datetime import datetime

from django.contrib.postgres.search import SearchQuery, SearchRank, SearchVector
from django.db import connection
from django.db.models import F, Q
from django.utils import timezone
from loguru import logger
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.serializers.CommitteeDetailSerialzer import CommitteeSittingSerializer
from api.serializers.detail_serializers import InterpellationSerializer
from api.serializers.list_serializers import (
    ActListSerializer,
    PrintListSerializer,
    ProcessListSerializer,
    VotingListSerializer,
)
from eli_app.models import Act
from sejm_app.models import (
    CommitteeSitting,
    Interpellation,
    PrintModel,
    Process,
    Voting,
)


class OptimizedSearchView(APIView):
    def get(self, request):
        query = request.GET.get("q")
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")

        logger.info(
            f"Received search request: query='{query}', start_date='{start_date}', end_date='{end_date}'"
        )

        if not query:
            logger.warning("Empty search query received")
            return Response(
                {"error": "Query parameter 'q' is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            start_date = (
                datetime.strptime(start_date, "%Y-%m-%d").date() if start_date else None
            )
            end_date = (
                datetime.strptime(end_date, "%Y-%m-%d").date() if end_date else None
            )
        except ValueError as e:
            logger.error(f"Invalid date format: {e}")
            return Response(
                {"error": "Invalid date format. Use YYYY-MM-DD."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        search_query = SearchQuery(query, config="pl_ispell")

        search_configs = [
            (
                "committee_sittings",
                CommitteeSitting,
                CommitteeSittingSerializer,
                SearchVector("agenda", "committee__name", config="pl_ispell"),
                "date",
            ),
            (
                "interpellations",
                Interpellation,
                InterpellationSerializer,
                SearchVector(
                    "title",
                    "fromMember__firstName",
                    "fromMember__lastName",
                    config="pl_ispell",
                ),
                "receiptDate",
            ),
            (
                "processes",
                Process,
                ProcessListSerializer,
                SearchVector("title", "description", config="pl_ispell"),
                "processStartDate",
            ),
            (
                "prints",
                PrintModel,
                PrintListSerializer,
                SearchVector("title", config="pl_ispell"),
                "deliveryDate",
            ),
            (
                "acts",
                Act,
                ActListSerializer,
                SearchVector("title", "keywords__name", config="pl_ispell"),
                "announcementDate",
            ),
            (
                "votings",
                Voting,
                VotingListSerializer,
                SearchVector("title", "description", "topic", config="pl_ispell"),
                "date",
            ),
        ]

        results = {}
        with connection.execute_wrapper(self._query_debugger):
            for key, model, serializer, vector, date_field in search_configs:
                queryset = self.search_model(
                    model, vector, search_query, start_date, end_date, date_field
                )
                results[key] = serializer(queryset, many=True).data

        logger.info(
            f"Search completed. Results count: {sum(len(v) for v in results.values())}"
        )
        return Response(results)

    def search_model(
        self, model, search_vector, search_query, start_date, end_date, date_field
    ):
        queryset = model.objects.annotate(
            search=search_vector, rank=SearchRank(search_vector, search_query)
        ).filter(search=search_query)

        if start_date:
            queryset = queryset.filter(**{f"{date_field}__gte": start_date})
        if end_date:
            queryset = queryset.filter(**{f"{date_field}__lte": end_date})

        return queryset.order_by("-rank")[:10]  # Limit to top 10 results per model

    def _query_debugger(self, execute, sql, params, many, context):
        logger.debug(f"Executing SQL: {sql}")
        start = timezone.now()
        result = execute(sql, params, many, context)
        duration = timezone.now() - start
        logger.debug(f"Query duration: {duration.total_seconds():.3f} seconds")
        return result

    @staticmethod
    def optimize_database():
        with connection.cursor() as cursor:
            logger.info("Optimizing database indexes...")
            cursor.execute(
                "CREATE INDEX IF NOT EXISTS committee_sitting_search_idx ON sejm_app_committeesitting USING GIN (to_tsvector('pl_ispell', agenda || ' ' || committee_id))"
            )
            cursor.execute(
                "CREATE INDEX IF NOT EXISTS interpellation_search_idx ON sejm_app_interpellation USING GIN (to_tsvector('pl_ispell', title || ' ' || \"fromMember_id\"))"
            )
            cursor.execute(
                "CREATE INDEX IF NOT EXISTS process_search_idx ON sejm_app_process USING GIN (to_tsvector('pl_ispell', title || ' ' || description))"
            )
            cursor.execute(
                "CREATE INDEX IF NOT EXISTS print_search_idx ON sejm_app_printmodel USING GIN (to_tsvector('pl_ispell', title))"
            )
            cursor.execute(
                "CREATE INDEX IF NOT EXISTS act_search_idx ON eli_app_act USING GIN (to_tsvector('pl_ispell', title))"
            )
            cursor.execute(
                "CREATE INDEX IF NOT EXISTS voting_search_idx ON sejm_app_voting USING GIN (to_tsvector('pl_ispell', title || ' ' || description))"
            )
            logger.info("Database optimization completed")


# Run this method once to create the necessary indexes
# OptimizedSearchView.optimize_database()
