from django.db.models import Count, F, Q
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.views.generic import ListView
from meta.views import MetadataMixin

from sejm_app.models import Club, Envoy


class EnvoyListView(MetadataMixin, ListView):
    model = Envoy
    template_name = "envoy_list.html"
    title = "Lista Posłów - Sejm Stats"
    description = "Przeglądaj listę posłów w Sejm Stats. Znajdź informacje o wszystkich posłach w polskim Sejmie."  # replace with your template
    context_object_name = "envoys"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["clubs"] = Club.objects.all()
        context["selected_clubs"] = self.request.GET.getlist("club")
        context["districts"] = Envoy.objects.values("districtName")
        context["selected_districts"] = self.request.GET.getlist("district")
        return context

    def get_queryset(self):
        search_query = self.request.GET.get("searchEnvoys")
        clubs = self.request.GET.getlist("club")
        districts = self.request.GET.getlist("district")
        most_active = self.request.GET.get("most_active")
        queryset = super().get_queryset()
        if search_query:
            query_parts = search_query.strip().split()
            qf = Q()
            for part in query_parts:
                qf &= Q(firstName__icontains=part) | Q(lastName__icontains=part)
            queryset = queryset.filter(qf)
        if clubs:
            queryset = queryset.filter(club__id__in=clubs)
        if districts and "all" not in districts:
            queryset = queryset.filter(districtName__in=districts)
        queryset = queryset.order_by("lastName")
        if most_active:
            queryset = sorted(queryset, key=lambda x: x.total_activity, reverse=True)[
                :10
            ]

        return queryset
