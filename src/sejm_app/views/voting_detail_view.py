
import json

from django.conf import settings
from django.core import serializers
from django.db.models import Case, Count, IntegerField, Q, When
from django.views.generic import DetailView

from sejm_app.models import Process, Voting
from sejm_app.models.vote import VoteOption

colors = settings.COLORS


class VotingDetailView(DetailView):
    model = Voting
    template_name = "voting_detail.html"  # replace with your template
    context_object_name = "voting"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        club_votes = list(
            self.object.club_votes.values("club", "yes", "no", "abstain", "voting")
        )
        context["total_data"] = [
            self.object.votes.filter(vote=VoteOption.YES).count(),
            self.object.votes.filter(vote=VoteOption.NO).count(),
            self.object.votes.filter(vote=VoteOption.ABSTAIN).count(),
        ]

        context["total_labels"] = ["Za", "Przeciw", "Wstrzymał się"]
        context["total_colors"] = [colors.SUCCESS, colors.DANGER, colors.WARNING]
        context["club_votes"] = json.dumps(club_votes)

        male_votes = self.object.votes.filter(MP__isFemale=False).aggregate(
            yes=Count(
                Case(When(vote=VoteOption.YES, then=1), output_field=IntegerField())
            ),
            no=Count(
                Case(When(vote=VoteOption.NO, then=1), output_field=IntegerField())
            ),
            abstain=Count(
                Case(When(vote=VoteOption.ABSTAIN, then=1), output_field=IntegerField())
            ),
        )

        female_votes = self.object.votes.filter(MP__isFemale=True).aggregate(
            yes=Count(
                Case(When(vote=VoteOption.YES, then=1), output_field=IntegerField())
            ),
            no=Count(
                Case(When(vote=VoteOption.NO, then=1), output_field=IntegerField())
            ),
            abstain=Count(
                Case(When(vote=VoteOption.ABSTAIN, then=1), output_field=IntegerField())
            ),
        )

        context["sex_votes"] = json.dumps({"male": male_votes, "female": female_votes})
        prints = self.object.prints.filter(processPrint__isnull=True)
        context["processes"] = Process.objects.filter(Q(printModel__in=prints))

        similar_prints = prints.values_list("id", flat=True)
        context["similar_votings"] = (
            Voting.objects.filter(prints__in=similar_prints)
            .exclude(id=self.object.id)
            .distinct()
        )
        return context
