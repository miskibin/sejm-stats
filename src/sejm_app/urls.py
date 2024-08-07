from django.urls import path
from django.views.decorators.cache import cache_page

from sejm_app.views.handlers import Error413View

from .views import *

urlpatterns = [
    # path("", HomeView.as_view(), name="home"),
    # path(
    #     "last-update/",
    #     cache_page(60 * 15)(LastUpdateView.as_view()),
    #     name="last_update",
    # ),
    # path("search/", cache_page(60 * 5)(SearchResultView.as_view()), name="search"),
    # path("envoys/", cache_page(60 * 5)(EnvoyListView.as_view()), name="envoys"),
    # path(
    #     "envoys/<int:pk>",
    #     EnvoyDetailView.as_view(),
    #     name="envoy_detail",
    # ),
    # path("clubs/", cache_page(60 * 5)(ClubListView.as_view()), name="clubs"),
    # path(
    #     "clubs/<str:pk>/",
    #     ClubDetailView.as_view(),
    #     name="club_detail",
    # ),
    # path("votings/", cache_page(60 * 5)(VotingHTMLListView.as_view()), name="votings"),
    # path(
    #     "api/votings/",
    #     cache_page(60 * 5)(VotingJSONListView.as_view()),
    #     name="api_votings",
    # ),
    # path(
    #     "voting/<int:pk>/",
    #     VotingDetailView.as_view(),
    #     name="voting_detail",
    # ),
    # path("faq/", cache_page(60 * 5)(AboutView.as_view()), name="faq"),
    # path(
    #     "committees/",
    #     cache_page(60 * 5)(CommitteeHTMLListView.as_view()),
    #     name="committees",
    # ),
    # path(
    #     "api/committees/",
    #     cache_page(60 * 5)(CommitteeJSONListView.as_view()),
    #     name="api_committees",
    # ),
    # path(
    #     "committee/<str:pk>/",
    #     CommitteeDetailView.as_view(),
    #     name="committee_detail",
    # ),
    # path("scandals/", ScandalListView.as_view(), name="scandals"),
    # path(
    #     "processes/",
    #     ProcessHTMLListView.as_view(),
    #     name="processes",
    # ),
    # path(
    #     "api/processes/",
    #     ProcessJSONListView.as_view(),
    #     name="api_processes",
    # ),
    path("api/update/", UpdateView.as_view(), name="update"),
    # path(
    #     "process/<int:pk>/",
    #     ProcessDetailView.as_view(),
    #     name="process_detail",
    # ),
    # path(
    #     "interpellations/",
    #     InterpellationHTMLListView.as_view(),
    #     name="interpellations",
    # ),
    # path(
    #     "api/interpellations/",
    #     InterpellationJSONListView.as_view(),
    #     name="api_interpellations",
    # ),
    # path(
    #     "interpellations/<int:pk>/",
    #     InterpellationDetailView.as_view(),
    #     name="interpellation_detail",
    # ),
    # path("404", Error404View.as_view()),
    # path("500", Error500View.as_view()),
    # path("413", Error413View.as_view()),
]
handler413 = Error413View.as_view()
handler404 = Error404View.as_view()
handler500 = Error500View.as_view()
