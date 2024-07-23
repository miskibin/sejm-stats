from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import HttpResponseForbidden
from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse_lazy
from django.views.generic import (
    CreateView,
    DeleteView,
    DetailView,
    ListView,
    UpdateView,
)
from rolepermissions.mixins import HasRoleMixin

from accounts.forms import ArticleForm
from community_app.models import Article


class ArticleCreateView(LoginRequiredMixin, HasRoleMixin, CreateView):
    allowed_roles = "journalist"
    template_name = "account_panel/article/article_create.html"
    success_url = reverse_lazy("article_list")
    form_class = ArticleForm
    model = Article

    def form_valid(self, form):
        form.instance.author = self.request.user
        form.instance.status = Article.Status.WAITING_FOR_APPROVE
        form.save()
        return super().form_valid(form)

    def post(self, request, *args, **kwargs):
        form = self.get_form()
        for k, v in request.POST.items():
            if "wysiwyg" in k:
                form.data = form.data.copy()
                form.data["content"] = v
                break
        if form.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)


class ArticleUpdateView(LoginRequiredMixin, HasRoleMixin, UpdateView):
    allowed_roles = "journalist"
    template_name = "account_panel/article/article_create.html"
    success_url = reverse_lazy("article_list")
    form_class = ArticleForm
    model = Article

    def dispatch(self, request, *args, **kwargs):
        article = self.get_object()
        if article.author != self.request.user:
            return HttpResponseForbidden("You are not allowed to edit this article.")
        return super().dispatch(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        self.object = self.get_object()
        form = self.get_form()
        for k, v in request.POST.items():
            if "wysiwyg" in k:
                form.data = form.data.copy()
                form.data["content"] = v
                break
        if form.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)


class ArticleDetailView(LoginRequiredMixin, HasRoleMixin, DetailView):
    allowed_roles = "journalist"
    model = Article
    template_name = "account_panel/article/article_preview.html"

    def dispatch(self, request, *args, **kwargs):
        article = self.get_object()
        if article.author != self.request.user:
            return HttpResponseForbidden("You are not allowed to preview this article.")
        return super().dispatch(request, *args, **kwargs)


class ArticleDeleteView(LoginRequiredMixin, HasRoleMixin, DeleteView):
    success_url = reverse_lazy("article_list")

    def post(self, request, *args, **kwargs):
        article = get_object_or_404(Article, slug=kwargs["slug"])
        if article.author != request.user:
            return HttpResponseForbidden("You are not allowed to delete this article.")
        article.delete()
        return redirect(self.success_url)


class ArticleListView(LoginRequiredMixin, HasRoleMixin, ListView):
    allowed_roles = "journalist"
    template_name = "account_panel/article/article_list.html"
    context_object_name = "articles"

    def get_queryset(self):
        return Article.objects.filter(author=self.request.user)
