from django.views.generic import DetailView

from sejm_app.models import Interpellation


class InterpellationDetailView(DetailView):
    model = Interpellation
    template_name = "interpellation_detail.html"  # Path to the template
    context_object_name = "interpellations"
    paginate_by = 10  # Adjust the number of items per page as needed
