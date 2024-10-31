from django.contrib import admin

from eli_app import models

# Register your models here.


@admin.register(models.Act)
class act_admin(admin.ModelAdmin):
    list_display = (
        "ELI",
        "title",
    )


@admin.register(models.ActSection)
class ActSection(admin.ModelAdmin):
    list_display = ("chapters",)


@admin.register(models.Publisher)
class publisher_admin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(models.ActStatus)
class act_status_admin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(models.DocumentType)
class document_type_admin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(models.Institution)
class institution_admin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(models.Keyword)
class keyword_admin(admin.ModelAdmin):
    list_display = ("name",)
