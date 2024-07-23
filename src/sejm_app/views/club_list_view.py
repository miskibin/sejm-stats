import json

from django.db.models import Count
from django.views.generic import ListView
from meta.views import MetadataMixin

from sejm_app.models import Club


class ClubListView(MetadataMixin, ListView):
    model = Club
    template_name = "club_list.html"
    context_object_name = "clubs"
    title = "Lista klubów - Sejm Stats"
    description = "Przeglądaj listę klubów w Sejm Stats. Znajdź informacje o różnych klubach w polskim Sejmie."

    def get_queryset(self):
        # Annotate each club with the count of its envoys and order by this count
        return Club.objects.order_by("-membersCount")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        clubs_list = [
            {"id": club.id, "envoys_count": club.membersCount}
            for club in context["clubs"]
        ]
        context["clubs_json"] = json.dumps(clubs_list)
        return context
