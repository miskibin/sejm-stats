from __future__ import annotations

from django.db import models
from django.utils.functional import cached_property
from loguru import logger

from sejm_app.utils import camel_to_snake, parse_all_dates

from .club import Club
from .envoy import Envoy
from .print_model import PrintModel
from .stage import Stage


class CreatedByEnum(models.TextChoices):
    ENVOYS = "posłowie"
    CLUB = "klub"
    PRESIDIUM = "prezydium"
    CITIZENS = "obywatele"
    GOVERNMENT = "rząd"


class Process(models.Model):
    """
    api https://api.sejm.gov.pl/sejm/openapi/ui/#/default/get_sejm_term_term__processes__num_
    """

    id = models.CharField(max_length=10, primary_key=True, unique=True)
    UE = models.BooleanField(
        choices=((True, "YES"), (False, "NO")), null=True, blank=True
    )
    comments = models.TextField(default="Brak")
    number = models.IntegerField()
    term = models.IntegerField()
    webGeneratedDate = models.DateTimeField(null=True, blank=True)
    changeDate = models.DateField(null=True)
    description = models.TextField(default="Brak")
    documentDate = models.DateField()
    documentType = models.CharField(max_length=64)
    legislativeCommittee = models.BooleanField()
    printModel = models.ForeignKey(
        PrintModel,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="process",
    )
    principleOfSubsidiarity = models.BooleanField()
    processStartDate = models.DateField()
    urgencyWithdrawDate = models.DateField(null=True, blank=True)
    rclNum = models.CharField(max_length=20)
    title = models.TextField()
    urgencyStatus = models.CharField(max_length=20)
    MPs = models.ManyToManyField(Envoy, related_name="processes", blank=True)
    club = models.ForeignKey(
        Club, on_delete=models.CASCADE, related_name="processes", null=True, blank=True
    )
    createdBy = models.CharField(
        max_length=20,
        choices=CreatedByEnum.choices,
        null=True,
        blank=True,
        default=None,
    )
    pagesCount = models.SmallIntegerField(
        default=0, help_text="Number of pages in the document", blank=True
    )

    @cached_property
    def length_tag(self):
        if self.pagesCount < 3:
            return "bardzo krótki"
        if self.pagesCount < 10:
            return "krótki"
        if self.pagesCount < 20:
            return "średni"
        return "długi"

    # web_generated_date = models.DateTimeField()
    def __str__(self):
        return f"{self.number} {self.title}"

    @cached_property
    def is_finished(self) -> bool:
        if not self.stages.exists():
            return False
        return self.stages.last().stageName.lower() == "zamknięcie sprawy"
