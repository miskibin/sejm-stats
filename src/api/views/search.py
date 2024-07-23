from collections import Counter
from functools import reduce
from operator import or_

from django.contrib.postgres.search import SearchQuery, SearchVector
from django.db.models import Count, Q
from django.db.models.functions import TruncMonth
from loguru import logger
from rest_framework import viewsets
from rest_framework.response import Response

from api.serializers import *
from eli_app.models import Act
from sejm_app.models import CommitteeSitting, Envoy, Interpellation, PrintModel, Process


class SearchViewSet(viewsets.ViewSet):
    MAX_RESULTS = 100
    VECTOR_CONFIG = "pl_ispell"

    def get_search_vector(self, fields):
        return SearchVector(*fields, config=self.VECTOR_CONFIG)

    def get_search_query(self, keywords):
        return reduce(
            or_,
            [
                SearchQuery(keyword.strip(), config=self.VECTOR_CONFIG)
                for keyword in keywords
            ],
        )

    def get_queryset(self, model, search_vector):
        return model.objects.annotate(search=search_vector).filter(
            search=self.combined_search_query
        )

    def perform_search(self, model, serializer, search_vector, order_by=None):
        queryset = self.get_queryset(model, search_vector)
        if order_by:
            queryset = queryset.order_by(order_by)
        return serializer(queryset[: self.MAX_RESULTS], many=True).data

    def get_top_items(self, items, field):
        if isinstance(items[0][field], dict):
            counts = Counter(item[field]["name"] for item in items)
        else:
            counts = Counter(item[field] for item in items)
        return {item: count for item, count in counts.most_common(3)}

    def get_items_per_month(self, queryset, date_field):
        items_per_month = (
            queryset.annotate(month=TruncMonth(date_field))
            .values("month")
            .annotate(count=Count("pk"))
            .order_by("month")
        )
        return {
            item["month"].strftime("%Y-%m"): item["count"] for item in items_per_month
        }

    def list(self, request):
        query = request.GET.get("q", "").strip()
        if not query:
            return Response({"error": "Empty search query"}, status=400)

        logger.debug(f"Query: {query}")
        keywords = query.split(",")

        try:
            self.combined_search_query = self.get_search_query(keywords)
        except Exception as e:
            logger.error(f"Error constructing search query: {e}")
            return Response({"error": "Invalid search query"}, status=400)

        vectors = {
            "title": self.get_search_vector(["title"]),
            "keywords": self.get_search_vector(["keywords"]),
            "person": self.get_search_vector(["firstName", "secondName", "lastName"]),
            "agenda": self.get_search_vector(["agenda"]),
        }

        committee_sittings = self.perform_search(
            CommitteeSitting, CommitteeSittingSerializer, vectors["agenda"]
        )
        top_committees = self.get_top_items(committee_sittings, "committee")

        interpellations = self.perform_search(
            Interpellation, InterpellationSerializer, vectors["title"], "-lastModified"
        )
        top_interpellations = self.get_top_items(interpellations, "fromMember")

        prints_queryset = self.get_queryset(PrintModel, vectors["title"])
        prints_per_month = self.get_items_per_month(prints_queryset, "deliveryDate")
        prints = PrintModelSerializer(prints_queryset, many=True).data

        acts_queryset = self.get_queryset(Act, vectors["title"])
        acts_per_month = self.get_items_per_month(acts_queryset, "announcementDate")
        acts = ActSerializer(acts_queryset, many=True).data

        results = {
            "committee_sittings": committee_sittings,
            "top_committees": top_committees,
            "interpellations": interpellations,
            "top_interpellations": top_interpellations,
            "prints": prints,
            "prints_per_month": prints_per_month,
            "acts": acts,
            "acts_per_month": acts_per_month,
        }

        logger.debug(f"Got results.")
        return Response(results)
