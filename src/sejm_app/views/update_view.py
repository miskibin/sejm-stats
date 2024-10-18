from celery import chain
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import View


@method_decorator(csrf_exempt, name="dispatch")  # Consider CSRF implications
class UpdateView(View):
    def get(self, request):
        if request.user and request.user.is_superuser:
            from sejm_app.tasks import community_tasks, eli_tasks, sejm_tasks

            task_result = chain(
                t.s() for t in sejm_tasks + eli_tasks + community_tasks
            ).delay()
            return JsonResponse(
                {"message": "Update initiated. Please check back shortly for results."}
            )
        else:
            return HttpResponseBadRequest(
                "You are not authorized to perform this action."
            )
