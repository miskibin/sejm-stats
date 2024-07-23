from django.urls import reverse
from django.views.generic import ListView
from loguru import logger
from meta.views import MetadataMixin

from core.generic.mixins import JsonResponseMixin, SearchFormMixin
from sejm_app.forms import CommitteeSearchForm
from sejm_app.models import Committee


class BaseCommitteeListView(ListView):
    model = Committee
    form_class = CommitteeSearchForm
    template_name = "committee_list.html"
    context_object_name = "committees"


class CommitteeHTMLListView(MetadataMixin, BaseCommitteeListView):
    title = "Lista Komitetów - Sejm Stats"
    description = "Przeglądaj listę komitetów w Sejm Stats. Znajdź informacje o różnych komitetach w polskim Sejmie."

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["form"] = CommitteeSearchForm(self.request.GET)
        return context

    def render_to_response(self, context, **response_kwargs):
        return super().render_to_response(context, **response_kwargs)


class CommitteeJSONListView(JsonResponseMixin, BaseCommitteeListView):
    def get_item_url(self, item: Committee):
        return reverse("committee_detail", kwargs={"pk": item.code})

    def get_json_fields(self):
        return ["code", "name", "compositionDate"]

    def render_to_response(self, context, **response_kwargs):
        return self.render_to_json_response(context, **response_kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()
        form = CommitteeSearchForm(self.request.GET)
        if form.is_valid():
            if form.cleaned_data["type"]:
                queryset = queryset.filter(type=form.cleaned_data["type"])
            if form.cleaned_data["appointmentDate_from"]:
                queryset = queryset.filter(
                    appointmentDate__gte=form.cleaned_data["appointmentDate_from"]
                )
            if form.cleaned_data["appointmentDate_to"]:
                queryset = queryset.filter(
                    appointmentDate__lte=form.cleaned_data["appointmentDate_to"]
                )

        return queryset
