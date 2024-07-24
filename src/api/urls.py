from django.urls import include, path
from rest_framework.routers import DefaultRouter

from api.views.home import HomeViewSet
from api.views.search import SearchViewSet

from api import views

router = DefaultRouter()
router.register(r"voting/(?P<voting_id>\d+)", views.VotesViewSet, basename="voting")
router.register(r"articles", views.ArticleViewSet, basename="article")
router.register(r"search", SearchViewSet, basename="search")
router.register(r"envoys", views.EnvoyViewSet, basename="envoy")
router.register(
    r"interpellations", views.InterpellationViewSet, basename="interpellation"
)
router.register(r"clubs", views.ClubViewSet, basename="club")
router.register(r"acts", views.ActViewSet, basename="act")
router.register(
    r"committeeSittings/(?P<code>\d+)",
    views.CommitteeSittingViewSet,
    basename="committee-sitting",
)
router.register(
    r"committeeMembers/(?P<code>\d+)",
    views.CommitteeMemberViewSet,
    basename="committee-member",
)
router.register(r"committees", views.CommitteeViewSet, basename="committee")

app_name = "api"

urlpatterns = [
    path("home", HomeViewSet.as_view(), name="home-api"),
    path("", include(router.urls)),
]
