from django.shortcuts import render
from django.views.generic import DetailView, ListView

from community_app.models import Article


class ArticleListView(ListView):
    model = Article
    queryset = Article.objects.published().order_by("-published_at")
    template_name = "articles/article_list.html"
    context_object_name = "articles"
    paginate_by = 4


class ArticleDetailView(DetailView):
    model = Article
    queryset = Article.objects.published()
    template_name = "articles/article_detail.html"
    context_object_name = "article"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["latest_articles"] = Article.objects.published()[:5]
        context["meta"] = self.get_object().as_meta(self.request)
        return context


def privacy_policy(request):
    return render(request, "privacy_policy.html")
