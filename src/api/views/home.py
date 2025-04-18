from django.urls import reverse
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import status
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from sejm_app.models import Club, Committee, Process, Voting


class HomeViewSet(ViewSet):
    @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
    def list(self, request):
        latest_votings = Voting.objects.order_by("-date")[:4].values(
            "id", "title", "success", "category", "topic"
        )

        cards = [
            {
                "title": "Wszystkich głosowań",
                "count": Voting.objects.count(),
                "color": "destructive",
                "url": "/votings/",
            },
            {
                "title": "Komisji parlamentarnych",
                "count": Committee.objects.count(),
                "color": "destructive",
                "url": "/committees/",
            },
            {
                "title": "Wszystkich projektów",
                "count": Process.objects.count(),
                "color": "destructive",
                "url": "/processes/",
            },
            {
                "title": "Oczekujących projektów",
                "count": sum(
                    not process.is_finished for process in Process.objects.all()
                ),
                "color": "default",
                "url": "/processes/" + "?state=on",
            },
        ]

        data = {
            "latest_votings": latest_votings,
            "cards": cards,
        }

        return Response(data, status=status.HTTP_200_OK)
