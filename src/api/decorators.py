from django.http import HttpResponseForbidden
from django_ratelimit.decorators import ratelimit


def referer_rate_limit(key, rate, method=["GET"], block=False):
    def decorator(view_func):
        @ratelimit(key=key, rate=rate, method=method, block=block)
        def _wrapped_view(request, *args, **kwargs):
            referer = request.META.get("HTTP_REFERER", "")
            if "sejm-stats.pl" not in referer:
                return HttpResponseForbidden("Forbidden: Invalid referer")
            return view_func(request, *args, **kwargs)

        return _wrapped_view

    return decorator
