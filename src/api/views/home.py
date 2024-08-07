from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import status
from django.urls import reverse
from sejm_app.models import Club, Process, Voting, Committee


class HomeViewSet(ViewSet):
    def list(self, request):
        latest_votings = Voting.objects.order_by("-date")[:5].values(
            "id", "title", "success", "category"
        )
        all_clubs = Club.objects.count()

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
            "all_clubs": all_clubs,
            "cards": cards,
        }

        return Response(data, status=status.HTTP_200_OK)
