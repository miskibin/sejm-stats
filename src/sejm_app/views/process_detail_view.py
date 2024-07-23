from django.db.models import BooleanField, Case, Q, When
from django.views.generic import DetailView

from sejm_app.models import Process, Stage
from sejm_app.models.print_model import PrintModel


class ProcessDetailView(DetailView):
    model = Process
    template_name = "process_detail.html"
    context_object_name = "process"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["stages"] = self.object.stages.all().order_by("stageNumber")

        context["prints"] = (
            PrintModel.objects.filter(
                Q(processPrint__number=self.object.number)
                | Q(number=self.object.number)
            )
            .annotate(
                is_processPrint_null=Case(
                    When(processPrint__number=None, then=False),
                    default=True,
                    output_field=BooleanField(),
                )
            )
            .order_by("is_processPrint_null")
        )
        return context
