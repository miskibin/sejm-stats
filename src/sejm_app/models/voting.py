import re

import django
from django.conf import settings
from django.db import models
from django.utils.functional import cached_property
from django.utils.translation import gettext_lazy as _
from loguru import logger

from sejm_app.models.club import Club
from sejm_app.models.vote import ClubVote, Vote, VoteOption
from sejm_app.utils import camel_to_snake, parse_all_dates


class Voting(models.Model):
    class Category(models.TextChoices):
        APPLICATION = "APPLICATION", _("Wniosek formalny")
        PRINTS = "PRINTS", _("Głosowanie druków")
        WHOLE_PROJECT = "WHOLE_PROJECT", _("Głosowanie nad całością projektu")
        AMENDMENT = "AMENDMENT", _("Głosowanie nad poprawką")
        CANDIDATES = "CANDIDATES", _("Głosowanie na kandydatów")
        OTHER = "OTHER", _("Inne")

    class Kind(models.TextChoices):
        ELECTRONIC = "ELECTRONIC", _("Elektroniczne")
        TRADITIONAL = "TRADITIONAL", _("Tradycyjne")
        ON_LIST = "ON_LIST", _("Na liście")

    id = models.BigIntegerField(primary_key=True, help_text=_("Voting ID"))
    yes = models.SmallIntegerField(null=True, blank=True, help_text=_("Yes votes"))
    no = models.SmallIntegerField(null=True, blank=True, help_text=_("No votes"))
    abstain = models.SmallIntegerField(
        null=True, blank=True, help_text=_("Abstain votes")
    )
    category = models.CharField(
        max_length=32,
        choices=Category.choices,
        null=True,
        blank=True,
        help_text=_("Voting category"),
    )
    term = models.IntegerField(null=True, blank=True, help_text=_("Sejm term number"))
    sitting = models.IntegerField(
        null=True, blank=True, help_text=_("Number of the Sejm sitting")
    )
    sittingDay = models.IntegerField(
        null=True, blank=True, help_text=_("Day number of the Sejm sitting")
    )
    votingNumber = models.IntegerField(
        null=True, blank=True, help_text=_("Voting number")
    )
    date = models.DateTimeField(null=True, blank=True, help_text=_("Date of the vote"))
    title = models.CharField(
        max_length=512, null=True, blank=True, help_text=_("Voting topic")
    )
    description = models.CharField(
        max_length=512, null=True, blank=True, help_text=_("Voting description")
    )
    topic = models.CharField(
        max_length=512, null=True, blank=True, help_text=_("Short voting topic")
    )
    prints = models.ManyToManyField(
        "PrintModel",
        blank=True,
        help_text=_("Prints related to the voting"),
        related_name="votings",
    )
    pdfLink = models.URLField(
        null=True,
        blank=True,
        help_text=_("Link to the PDF document with voting details"),
    )
    kind = models.CharField(
        max_length=16,
        choices=Kind.choices,
        null=True,
        blank=True,
        help_text=_("Voting kind"),
    )

    success = models.BooleanField(
        null=True, blank=True, help_text=_("Whether the voting was successful")
    )

    class Meta:
        ordering = ["-date"]

    def _check_if_success(self) -> bool:
        if self.no + self.yes + self.abstain < 230:
            logger.warning(
                f"Voting {self.id} has less than 230 votes, no Kworum was reached"
            )
            return False
        return self.yes > self.no

    @cached_property
    def summary(self):
        if self.category == "WHOLE_PROJECT":
            prints = self.prints.all()
            return f"Całość projektu: {prints.first().title}"
        else:
            title = re.sub(r"^\s*Pkt\.\s*\d+\s*", "", self.title)
            return title

    def __str__(self):
        return f"{self.votingNumber}. {self.title}: {self.topic}"

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = self.sitting * 100000 + self.sittingDay * 1000 + self.votingNumber
        self.success = self._check_if_success()
        super().save(*args, **kwargs)


class VotingOption(models.Model):
    voting = models.ForeignKey(
        Voting,
        on_delete=models.CASCADE,
        help_text=_("Voting ID"),
        related_name="votingOptions",
    )
    option = models.CharField(max_length=255, help_text=_("Option name"))
    optionIndex = models.IntegerField(help_text=_("Option index"))
    votes = models.IntegerField(
        help_text=_("Number of votes"), default=0, null=True, blank=True
    )
