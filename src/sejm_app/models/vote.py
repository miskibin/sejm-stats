from django.db import models
from django.utils.translation import gettext_lazy as _

from sejm_app.models.envoy import Envoy
from sejm_app.utils import camel_to_snake, parse_all_dates


class VoteOption(models.IntegerChoices):
    NO = 0, _("No")
    YES = 1, _("Yes")
    ABSTAIN = 2, _("ABSTAIN")
    ABSENT = 3, _("ABSENT")
    VOTE_VALID = 4, _("VOTE_VALID")


class Vote(models.Model):
    id = models.IntegerField(primary_key=True)
    voting = models.ForeignKey("Voting", on_delete=models.CASCADE, related_name="votes")
    MP = models.ForeignKey("Envoy", on_delete=models.CASCADE, related_name="votes")
    vote = models.SmallIntegerField(
        choices=VoteOption.choices,
        help_text=_("Vote option"),
        null=True,
        blank=True,  # for list votes :(
    )

    def save(self, *args, **kwargs):
        self.id = self.voting.pk * 1000 + self.MP.pk
        super().save(*args, **kwargs)

    LABELS = {
        VoteOption.NO: "Przeciw",
        VoteOption.YES: "Za",
        VoteOption.ABSTAIN: "Wstzymanie się",
        VoteOption.ABSENT: "Nieobecność",
        VoteOption.VOTE_VALID: "Głos ważny",
    }

    @property
    def vote_label(self):
        return self.LABELS[self.vote]


class ListVote(models.Model):
    voteOption = models.SmallIntegerField(
        choices=VoteOption.choices,
        help_text=_("Vote option"),
    )
    vote = models.ForeignKey("Vote", on_delete=models.CASCADE, related_name="listVotes")
    optionIndex = models.ForeignKey("VotingOption", on_delete=models.CASCADE)


class ClubVote(models.Model):
    club = models.ForeignKey(
        "Club", on_delete=models.CASCADE, null=True, blank=True, related_name="votes"
    )
    yes = models.IntegerField(default=0)
    no = models.IntegerField(default=0)
    abstain = models.IntegerField(default=0)
    voting = models.ForeignKey(
        "Voting",
        on_delete=models.CASCADE,
        related_name="club_votes",
    )
