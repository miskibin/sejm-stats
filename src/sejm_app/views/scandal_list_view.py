from django.views.generic import ListView

from sejm_app.models import Scandal


class ScandalListView(ListView):
    model = Scandal
    template_name = "scandal_list.html"  # replace with your template
    context_object_name = "scandals"
