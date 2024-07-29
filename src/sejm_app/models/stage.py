from __future__ import annotations

from datetime import datetime

from django.db import models
from django.db.models import Max
from django.utils.dateparse import parse_date, parse_datetime
from loguru import logger

from sejm_app.utils import camel_to_snake, parse_all_dates

from .voting import Voting


class Stage(models.Model):
    process = models.ForeignKey(
        "Process", on_delete=models.CASCADE, null=True, related_name="stages"
    )
    stageNumber = models.IntegerField(null=True, blank=True)
    date = models.DateField(null=True, blank=True)
    stageName = models.CharField(max_length=255)
    sittingNum = models.IntegerField(null=True, blank=True)
    comment = models.TextField(null=True, blank=True)
    decision = models.CharField(max_length=255, null=True, blank=True)
    textAfter3 = models.URLField(null=True, blank=True)
    voting = models.ForeignKey(Voting, on_delete=models.CASCADE, null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.pk is None:  # only for new objects
            max_stage_number = (
                self.process.stages.aggregate(Max("stageNumber"))["stageNumber__max"]
                or 0
            )
            self.stageNumber = max_stage_number + 1
        super().save(*args, **kwargs)

    @property
    def result(self):
        pass_phrases = ("uchwalono", "przyjęto", "uchwałę")
        fail_phrases = ("nie przyjęto", "nie przyjeto", "odrzucono")
        if self.decision:
            if any(phrase in self.decision.lower() for phrase in pass_phrases):
                return "PASS"
            if any(phrase in self.decision.lower() for phrase in fail_phrases):
                return "FAIL"
        return ""

    def __str__(self) -> str:
        return f"{self.process.id} stage {self.stageNumber}: {self.stageName}"
