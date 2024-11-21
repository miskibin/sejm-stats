from django.contrib import admin

from community_app import models


@admin.register(models.Article)
class Article(admin.ModelAdmin):
    list_display = ("title",)