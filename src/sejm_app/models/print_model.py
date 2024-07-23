from __future__ import annotations

from datetime import datetime
from urllib.parse import urljoin

from django.conf import settings
from django.db import models
from django.db.models import F
from django.utils import timezone
from django.utils.functional import cached_property


class PrintModel(models.Model):
    id = models.CharField(max_length=13, primary_key=True, editable=False)
    processPrint = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True
    )
    number = models.CharField(max_length=10)
    term = models.SmallIntegerField()
    title = models.TextField()
    documentDate = models.DateField()
    deliveryDate = models.DateField()
    changeDate = models.DateTimeField()

    def save(self, *args, **kwargs):
        self.id = f"{self.term}{self.number}"
        super().save(*args, **kwargs)

    # id is term + number

    @cached_property
    def pdf_url(self) -> str:
        return f"{settings.SEJM_ROOT_URL}/prints/{self.number}/{self.number}.pdf"

    @cached_property
    def api_url(self) -> str:
        return f"settings.SEJM_ROOT_URL/prints/{self.number}"

    def __str__(self) -> str:
        return f"{self.number}. {self.title}"

    class Meta:
        ordering = ["deliveryDate"]


class AdditionalPrint(PrintModel):
    main_print = models.ForeignKey(
        PrintModel,
        related_name="additional_prints",
        on_delete=models.CASCADE,
    )
