import datetime

from django.conf import settings
from django.db import models
from django.utils.functional import cached_property

from .envoy import Envoy
from .print_model import PrintModel


class CommitteeType(models.TextChoices):
    EXTRAORDINARY = "EXTRAORDINARY", "Nadzwyczajna"
    INVESTIGATIVE = "INVESTIGATIVE", "Śledcza"
    STANDING = "STANDING", "Stała"


class Committee(models.Model):
    name = models.CharField(max_length=512)
    nameGenitive = models.CharField(max_length=512)
    code = models.CharField(max_length=10, primary_key=True, verbose_name="code")
    appointmentDate = models.DateField()
    compositionDate = models.DateField()
    phone = models.CharField(max_length=100, blank=True)
    scope = models.TextField(null=True)
    type = models.CharField(
        max_length=50, choices=CommitteeType.choices, default=CommitteeType.STANDING
    )

    @cached_property
    def friendlyCompositionDate(self):
        days_after_TERM_START_DATE = (
            self.compositionDate - settings.TERM_START_DATE
        ).days
        if days_after_TERM_START_DATE < 30:
            return f"początek kadencji ({days_after_TERM_START_DATE} dnia)"
        return self.compositionDate

    @cached_property
    def first_phone(self):
        return self.phone.split(",")[0]

    def __str__(self):
        return self.name


class MemberFunction(models.TextChoices):
    CHAIR = "CHAIR", "Przewodniczący"
    VICE_CHAIR = "VICE_CHAIR", "zastępca przewodniczącego"


class CommitteeMember(models.Model):
    committee = models.ForeignKey(
        Committee, related_name="members", on_delete=models.CASCADE
    )
    envoy = models.ForeignKey(Envoy, on_delete=models.CASCADE)
    function = models.CharField(
        max_length=100, blank=True, null=True, choices=MemberFunction.choices
    )  # Function within the committee

    class Meta:
        unique_together = ("committee", "envoy")
        ordering = ["function"]

    def __str__(self):
        return f"{self.envoy.full_name} - {self.committee.name}"


class CommitteeSitting(models.Model):
    agenda = models.TextField()
    closed = models.BooleanField()
    date = models.DateField()
    num = models.IntegerField()
    remote = models.BooleanField()
    video_url = models.URLField(null=True)
    committee = models.ForeignKey(
        Committee, on_delete=models.CASCADE, related_name="sittings"
    )
    prints = models.ManyToManyField(PrintModel, related_name="committee_sittings")

    @cached_property
    def pdf_transcript(self):
        return f"{settings.SEJM_ROOT_URL}/committees/{self.committee.code}/sittings/{self.num}/pdf"

    def __str__(self):
        return f"Committee Sitting {self.num} on {self.date}"

    class Meta:
        ordering = ["-date"]
