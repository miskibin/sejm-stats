from django.urls import path

from .views import *

name = "eli"
urlpatterns = [
    path("acts/", ActHTMLListView.as_view(), name="acts"),
    path("api/acts/", ActJSONListView.as_view(), name="api_acts"),
]
