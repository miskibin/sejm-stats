from django.shortcuts import render
from django.views import View
from meta.views import MetadataMixin


class SearchResultView(MetadataMixin, View):
    title = "Wyniki wyszukiwania - Sejm Stats"

    def get(self, request):
        return render(
            request,
            "query_results.html",
            {"query": request.GET.get("q", "").strip().split(",")},
        )
