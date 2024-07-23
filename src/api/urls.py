from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api.views.home import HomeViewSet
from api.views.search import SearchViewSet

from .views import ArticleViewSet, VotesViewSet, EnvoyViewSet, ClubViewSet,InterpellationViewSet

router = DefaultRouter()
router.register(r"voting/(?P<voting_id>\d+)", VotesViewSet, basename="voting")
router.register(r"articles", ArticleViewSet)
router.register(r"search", SearchViewSet, basename="search")
router.register(r"envoys", EnvoyViewSet)
router.register(r"interpellations", InterpellationViewSet)
router.register(r"clubs", ClubViewSet)
app_name = "api"

urlpatterns = [
    path("home", HomeViewSet.as_view(), name="home-api"),
    path("", include(router.urls)),
]
