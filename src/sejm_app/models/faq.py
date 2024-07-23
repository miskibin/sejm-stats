from django.db import models
from django.utils.translation import gettext_lazy as _


class FAQ(models.Model):
    question = models.CharField(max_length=255, null=True, blank=True)
    answer = models.TextField(null=True, blank=True)
    url1 = models.URLField(null=True, blank=True)
    url2 = models.URLField(null=True, blank=True)

    def __str__(self):
        return f"{self.question}"
