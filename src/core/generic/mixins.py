from abc import abstractmethod

from django.http import JsonResponse
from django.views.generic import ListView


class SearchFormMixin:
    form_class = None  # To be set in the subclass

    def get_queryset(self):
        queryset = super().get_queryset()
        form = self.form_class(self.request.GET)
        if form.is_valid():
            for field, value in form.cleaned_data.items():
                if value:
                    queryset = queryset.filter(**{field: value})
        return queryset


class JsonResponseMixin:
    def render_to_json_response(
        self, context, add_data: dict = {}, **response_kwargs
    ) -> JsonResponse:
        fields = self.get_json_fields()
        queryset = self.get_queryset()
        urls = [self.get_item_url(i) for i in queryset]
        data = list(queryset.values(*fields))
        data = [list(item.values()) for item in data]
        response_data = {"data": data, "urls": urls}
        response_data.update(add_data)
        return JsonResponse(response_data, safe=False)

    @abstractmethod
    def get_item_url(self, item):
        raise NotImplementedError()

    def get_json_fields(self):
        return ["title", "lastModified"]
