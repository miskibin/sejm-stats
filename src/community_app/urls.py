from django.urls import path

from .views import ArticleDetailView, ArticleListView, privacy_policy

urlpatterns = [
    path("privacy_policy/", privacy_policy, name="privacy_policy"),
    path("articles/", ArticleListView.as_view(), name="articles"),
    path("articles/<slug:slug>/", ArticleDetailView.as_view(), name="article_detail"),
]
