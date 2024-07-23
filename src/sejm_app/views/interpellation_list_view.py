from django.db.models import Count
from django.http import JsonResponse
from django.urls import reverse
from django.views.generic import ListView
from meta.views import MetadataMixin

from core.generic.mixins import JsonResponseMixin, SearchFormMixin
from sejm_app.forms import InterpellationSearchForm
from sejm_app.models import Interpellation
from sejm_app.models.envoy import Envoy


class BaseInterpellationListView(SearchFormMixin, ListView):
    model = Interpellation
    form_class = InterpellationSearchForm
    template_name = "interpellation_list.html"
    context_object_name = "interpellations"


class InterpellationHTMLListView(MetadataMixin, BaseInterpellationListView):
    title = "Lista Interpelacji - Sejm Stats"
    description = "Przeglądaj listę interpelacji w Sejm Stats. Znajdź informacje o różnych interpelacjach w polskim Sejmie."

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["form"] = InterpellationSearchForm(self.request.GET)
        return context

    def render_to_response(self, context, **response_kwargs):
        return super().render_to_response(context, **response_kwargs)


class InterpellationJSONListView(JsonResponseMixin, BaseInterpellationListView):
    def get_item_url(self, item: Interpellation):
        return item.bodyLink

    def render_to_response(self, context, **response_kwargs):
        return self.render_to_json_response(context, **response_kwargs)
