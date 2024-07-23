from django.urls import reverse
from django.views.generic import ListView
from loguru import logger
from meta.views import MetadataMixin

from core.generic.mixins import JsonResponseMixin, SearchFormMixin
from sejm_app.forms import ProcessSearchForm
from sejm_app.models import Process


class BaseProcessListView(ListView):
    model = Process
    template_name = "process_list.html"
    context_object_name = "processes"


class ProcessHTMLListView(MetadataMixin, BaseProcessListView):
    title = "Lista Procesów - Sejm Stats"
    description = "Przeglądaj listę procesów legislacyjnych w Sejm Stats. Znajdź szczegółowe informacje o różnych procesach, takich jak autor, data rozpoczęcia, status i więcej. Poznaj proces legislacyjny w polskim Sejmie."

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["form"] = ProcessSearchForm(self.request.GET)
        return context

    def render_to_response(self, context, **response_kwargs):
        return super().render_to_response(context, **response_kwargs)


class ProcessJSONListView(JsonResponseMixin, BaseProcessListView):
    def get_item_url(self, item: Process):
        return reverse("process_detail", kwargs={"pk": item.id})

    def get_json_fields(self):
        return ["title", "documentDate"]

    def render_to_response(self, context, **response_kwargs):
        return self.render_to_json_response(context, **response_kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()
        form = ProcessSearchForm(self.request.GET)
        if form.is_valid():
            if form.cleaned_data.get("documentType"):
                queryset = queryset.filter(
                    documentType__in=form.cleaned_data["documentType"]
                )
            if form.cleaned_data.get("state"):
                process_ids = [
                    process.id for process in queryset if process.is_finished is False
                ]
                queryset = queryset.filter(id__in=process_ids)
        return queryset
