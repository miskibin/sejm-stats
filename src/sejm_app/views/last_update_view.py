from celery.result import ResultSet
from django.http import JsonResponse
from django.views.generic import View
from django_celery_results.models import TASK_STATE_CHOICES, TaskResult

from sejm_app.utils import format_human_friendly_date


class LastUpdateView(View):
    def get(self, request, *args, **kwargs):
        last_result = (
            TaskResult.objects.filter(status="SUCCESS").order_by("-date_done").first()
        )
        if last_result is None:
            return JsonResponse(
                {
                    "message": "No task results found",
                }
            )
        else:
            return JsonResponse(
                {
                    "message": f"Ostatnia aktualizacja: {format_human_friendly_date(last_result.date_done)}",
                },
            )
