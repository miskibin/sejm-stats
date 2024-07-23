from django.db.models import F
from django.urls import reverse
from django.views.generic import TemplateView
from loguru import logger
from meta.views import MetadataMixin

from sejm_app.models import Club, Process, Scandal, Voting
from sejm_app.models.committee import Committee


class HomeView(MetadataMixin, TemplateView):
    template_name = "home.html"
    title = "Sejm Stats - Przejrzyste Dane Sejmowe"
    description = "Sejm Stats: Przejrzyste i aktualne dane z polskiego Sejmu. Analizuj działania posłów, głosowania, wydatki parlamentarne i więcej. Idealne narzędzie dla badaczy, dziennikarzy i obywateli."
    og_title = "Sejm Stats - Przejrzyste Dane Sejmowe"
    og_description = "Odkryj aktualne dane z polskiego Sejmu. Analizy, statystyki, wydatki parlamentarne i działania posłów - wszystko w jednym miejscu."

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["latest_votings"] = Voting.objects.order_by("-date")[:5]
        context["all_clubs"] = Club.objects.count()

        cards = [
            {
                "title": "Wszystkich głosowań",
                "count": Voting.objects.count(),
                "color": "text-primary",
                "url": reverse("votings"),
            },
            {
                "title": "Komisji parlamentarnych",
                "count": Committee.objects.count(),
                "color": "text-primary",
                "url": reverse("committees"),
            },
            {
                "title": "Wszystkich projektów",
                "count": Process.objects.count(),
                "color": "text-primary",
                "url": reverse("processes"),
            },
            {
                "title": "Oczekujących projektów",
                "count": sum(
                    not process.is_finished for process in Process.objects.all()
                ),
                "color": "text-danger",
                # http://127.0.0.1:8000/processes/?state=on
                "url": reverse("processes") + "?state=on",
            },
        ]
        context["cards"] = cards
        return context
