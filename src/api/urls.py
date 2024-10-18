from django.urls import include, path
from api.views.vector_search import VectorSearchView
from rest_framework.routers import DefaultRouter

from api import views
from api.views.article import ArticleViewSet
from api.views.home import HomeViewSet
from api.views.search import OptimizedSearchView

router = DefaultRouter()
router.register(r"envoys", views.EnvoyViewSet, basename="envoy")
router.register(
    r"interpellations", views.InterpellationViewSet, basename="interpellation"
)
router.register(r"faq", views.FAQViewSet, basename="faq")
router.register(r"clubs", views.ClubViewSet, basename="club")
router.register(r"acts", views.ActViewSet, basename="act")
router.register(r"acts-meta", views.ActsMetaViewSet, basename="act-meta")
router.register(r"committees", views.CommitteeViewSet, basename="committee")
router.register(r"votings", views.VotingViewSet, basename="votings")
router.register(r"votings-meta", views.VotingsMetaViewSet, basename="voting-meta")
router.register(r"processes", views.ProcessViewSet, basename="processes")
router.register(r"processes-meta", views.ProcessesMetaViewSet, basename="process-meta")
router.register(r"home", views.HomeViewSet, basename="home")
router.register(r"articles", ArticleViewSet)

app_name = "api"

urlpatterns = [
    path("", include(router.urls)),
    path("search", OptimizedSearchView.as_view(), name="search"),
    path("vector-search/", VectorSearchView.as_view(), name="vector-search"),
    path("total-stats", views.TotalStatsView.as_view(), name="total-stats"),
]
