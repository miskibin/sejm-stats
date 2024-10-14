from datetime import datetime, timedelta

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
        range_param = request.GET.get("range")
        limit = int(request.GET.get("limit", 50))
        self.optimize_database()
        logger.info(
            f"Received search request: query='{query}', range='{range_param}', limit='{limit}'"
        )

        if not query:
            logger.warning("Empty search query received")
            return Response(
                {"error": "Query parameter 'q' is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Calculate start_date based on range parameter
        end_date = timezone.now().date()
        if range_param == "1m":
            start_date = end_date - timedelta(days=30)
        elif range_param == "3m":
            start_date = end_date - timedelta(days=90)
        elif range_param == "6m":
            start_date = end_date - timedelta(days=180)
        elif range_param == "12m":
            start_date = end_date - timedelta(days=365)
        elif range_param == "all":
            start_date = None
        else:
            start_date = None
            end_date = None

        # Split query into multiple phrases
        search_queries = [
            SearchQuery(phrase.strip(), config="pl_ispell")
            for phrase in query.split(",")
        ]
        combined_search_query = search_queries[0]
        for q in search_queries[1:]:
            combined_search_query |= q

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
        active_searches = [
            key
            for key, *_ in search_configs
            if request.GET.get(key, "false").lower() == "true"
        ]

        with connection.execute_wrapper(self._query_debugger):
            for key, model, serializer, vector, date_field in search_configs:
                if key in active_searches:
                    queryset = self.search_model(
                        model,
                        vector,
                        combined_search_query,
                        start_date,
                        end_date,
                        date_field,
                        limit,
                    )
                    results[key] = serializer(queryset, many=True).data

        logger.info(
            f"Search completed. Results count: {sum(len(v) for v in results.values())}"
        )
        return Response(results)

    def search_model(
        self,
        model,
        search_vector,
        search_query,
        start_date,
        end_date,
        date_field,
        limit,
    ):
        queryset = model.objects.annotate(
            search=search_vector, rank=SearchRank(search_vector, search_query)
        ).filter(search=search_query)

        if start_date:
            queryset = queryset.filter(**{f"{date_field}__gte": start_date})
        if end_date:
            queryset = queryset.filter(**{f"{date_field}__lte": end_date})

        return queryset.order_by("-rank")[
            :limit
        ]  # Limit to specified number of results per model

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
