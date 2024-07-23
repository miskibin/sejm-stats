import json

from django.db.models import Count
from django.http import JsonResponse
from django.urls import reverse
from django.views.generic import ListView
from loguru import logger
from meta.views import MetadataMixin

from core.generic.mixins import JsonResponseMixin, SearchFormMixin
from eli_app.forms import SearchForm
from eli_app.models import Act


class BaseActListView(ListView):
    model = Act
    form_class = SearchForm
    template_name = "act_list.html"
    context_object_name = "acts"


class ActHTMLListView(MetadataMixin, BaseActListView):
    title = "Akty prawne - Sejm Stats"
    description = "Przeglądaj listę aktów prawnych w Sejm Stats. Znajdź informacje o różnych aktach prawnych w polskim Sejmie."

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["form"] = SearchForm(self.request.GET)
        return context

    def render_to_response(self, context, **response_kwargs):
        return super().render_to_response(context, **response_kwargs)


class ActJSONListView(JsonResponseMixin, BaseActListView):
    def get_item_url(self, item: Act):
        return item.url

    def get_queryset(self):
        queryset = Act.objects.order_by("-changeDate")
        form = SearchForm(self.request.GET or None)
        if form.is_valid():
            keywords = form.cleaned_data.get("keywords")
            if keywords and not isinstance(keywords, list):
                keywords = [keywords]
            publisher = form.cleaned_data.get("publisher")
            status = form.cleaned_data.get("status")
            minDate = form.cleaned_data.get("minDate")
            maxDate = form.cleaned_data.get("maxDate")
            if keywords:
                queryset = queryset.filter(keywords__in=keywords)
            if publisher:
                queryset = queryset.filter(publisher=publisher)
            if status:
                queryset = queryset.filter(status=status)
            if minDate:
                queryset = queryset.filter(changeDate__gte=minDate)
            if maxDate:
                queryset = queryset.filter(changeDate__lte=maxDate)
        return queryset

    def get_json_fields(self):
        return ["ELI", "title", "changeDate"]

    def render_to_response(self, context, **response_kwargs):
        return self.render_to_json_response(context, **response_kwargs)
