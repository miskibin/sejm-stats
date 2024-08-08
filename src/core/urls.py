from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

# prefix


urlpatterns = (
    [
        path("apiInt/admin/", admin.site.urls),
        path("apiInt/", include("api.urls")),
        path("apiInt/accounts/", include("accounts.urls")),
        path("", include("sejm_app.urls")),
        # path("", include("eli_app.urls")),
        # path("", include("community_app.urls")),
        # path("select2/", include("django_select2.urls")),
    ]
    + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
)

if settings.DEBUG:
    import debug_toolbar

    urlpatterns = [
        path("__debug__/", include(debug_toolbar.urls)),
    ] + urlpatterns
