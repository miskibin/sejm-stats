from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api.views.home import HomeViewSet
from api.views.search import SearchViewSet

from api import views 

router = DefaultRouter()
router.register(r"voting/(?P<voting_id>\d+)", views.VotesViewSet, basename="voting")
router.register(r"articles", views.ArticleViewSet)
router.register(r"search", SearchViewSet, basename="search")
router.register(r"envoys", views.EnvoyViewSet)
router.register(r"interpellations", views.InterpellationViewSet)
router.register(r"clubs", views.ClubViewSet)
router.register(r"acts", views.ActViewSet)
app_name = "api"

urlpatterns = [
    path("home", HomeViewSet.as_view(), name="home-api"),
    path("", include(router.urls)),
]
