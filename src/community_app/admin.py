from django.contrib import admin

from community_app.models import Article, ArticleCategory, ArticleTag, TeamMember


class ArticleAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "created_at", "status")
    list_filter = ("author", "status", "created_at")
    list_per_page = 50
    search_fields = ("title", "content")
    date_hierarchy = "created_at"
    prepopulated_fields = {"slug": ("title",)}


class ArticleTagAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    list_per_page = 50
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


class ArticleCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    list_per_page = 50
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


admin.site.register(Article, ArticleAdmin)
admin.site.register(ArticleTag, ArticleTagAdmin)
admin.site.register(TeamMember)
admin.site.register(ArticleCategory, ArticleCategoryAdmin)
