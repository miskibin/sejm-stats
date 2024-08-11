import html
from datetime import datetime

from ckeditor.fields import RichTextField
from django.conf import settings
from django.db import models
from django.template.defaultfilters import safe, slugify
from django.urls import reverse
from django.utils.functional import cached_property
from django.utils.html import strip_tags
from django.utils.translation import gettext_lazy as _
from meta.models import ModelMeta
from rest_framework import serializers


class Article(models.Model):
    title = models.CharField(max_length=200)
    content = models.JSONField()  # Store Slate's content as JSON
    image = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class TeamMember(models.Model):
    class Role(models.IntegerChoices):
        CREATOR = 0, _("Twórca aplikacji")
        DEVELOPER = 1, _("Programista")
        SUPPORTER = 2, _("Wyjątkowo chojny wspierający")
        SUPPORTER_SMALL = 3, _("Wspierający")

    # badge = models.CharField(max_length=10, null=True, blank=True)
    name = models.CharField(max_length=64)
    role = models.IntegerField(choices=Role.choices, default=Role.SUPPORTER_SMALL)
    since = models.CharField(max_length=7, default="YYYY-MM")
    facebook_url = models.URLField(null=True, blank=True)
    # linkedin_url = models.URLField(null=True, blank=True)
    about = models.TextField(null=True, blank=True)
    photo = models.ImageField(upload_to="photos", null=True, blank=True)

    def __str__(self) -> str:
        return f"{self.name} - {self.role}"

    class Meta:
        ordering = ["-role"]
