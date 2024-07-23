from django.db import models
from django.utils.functional import cached_property
from django.utils.translation import gettext_lazy as _
from loguru import logger

from sejm_app.models.envoy import Envoy
from sejm_app.utils import camel_to_snake, parse_all_dates


class Reply(models.Model):
    interpellation = models.ForeignKey(
        "Interpellation", on_delete=models.CASCADE, related_name="replies"
    )
    key = models.CharField(max_length=255)
    receiptDate = models.DateField()
    lastModified = models.DateField()
    fromMember = models.ForeignKey(
        Envoy, on_delete=models.CASCADE, related_name="replies", null=True
    )
    fromNotEnvoy = models.CharField(max_length=255, null=True, blank=True)
    bodyLink = models.URLField(null=True)
    onlyAttachment = models.BooleanField(default=False)
    attachments = models.JSONField(default=list)

    def __str__(self):
        return self.key

    @property
    def author(self):
        if self.fromMember:
            return self.fromMember
        return self.fromNotEnvoy


class Interpellation(models.Model):
    term = models.IntegerField(help_text=_("Parliamentary term"), null=True)
    num = models.IntegerField(help_text=_("Interpellation number"), null=True)
    title = models.CharField(
        max_length=512, help_text=_("Title of the interpellation"), null=True
    )
    # title_stemmed = models.GeneratedField(

    receiptDate = models.DateField(help_text=_("Date of receipt"), null=True)
    lastModified = models.DateField(help_text=_("Last modified date"), null=True)
    bodyLink = models.URLField(
        help_text=_("Link to the interpellation body"), null=True
    )
    fromMember = models.ForeignKey(
        Envoy, on_delete=models.CASCADE, related_name="interpellations", null=True
    )
    to = models.JSONField(
        default=list, help_text=_("Recipients of the interpellation"), null=True
    )
    sentDate = models.DateField(help_text=_("Date sent"), null=True)
    repeatedInterpellation = models.JSONField(
        default=list, help_text=_("Repeated interpellation references"), null=True
    )
    id = models.IntegerField(primary_key=True, editable=False)

    def save(self, *args, **kwargs):
        self.id = self.term * 1000 + self.num
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.receiptDate})"
