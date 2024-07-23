from django.views.generic import TemplateView


class Error404View(TemplateView):
    template_name = "generic/404.html"


class Error500View(TemplateView):
    template_name = "generic/500.html"


class Error413View(TemplateView):
    template_name = "generic/413.html"
