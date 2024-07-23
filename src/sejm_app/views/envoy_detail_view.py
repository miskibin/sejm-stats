import json

# import defaultdict
from collections import defaultdict

from django.conf import settings
from django.db import models
from django.views.generic import DetailView
from loguru import logger

from sejm_app.models import ClubVote, CommitteeMember, Envoy, VoteOption, Voting

colors = settings.COLORS


class EnvoyDetailView(DetailView):
    model = Envoy
    template_name = "envoy_detail.html"  # replace with your template
    context_object_name = "envoy"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["interpellations"] = self.object.interpellations.all()
        context["latest_votings"] = self.get_latest_votings(5)
        discipline_ratio = self.get_discipline_ratio()
        context["discipline_ratio_labels"] = json.dumps(list(discipline_ratio.keys()))
        context["discipline_ratio_values"] = json.dumps(list(discipline_ratio.values()))
        context["discipline_ratio_colors"] = json.dumps(
            [colors.SUCCESS, colors.WARNING, colors.DANGER]
        )
        context["member_of"] = CommitteeMember.objects.filter(envoy=self.object)
        # max_activity = 100
        # for envoy in Envoy.objects.all():
        #     if envoy.total_activity > max_activity:
        #         max_activity = envoy.total_activity
        # print(max_activity)
        context["activity"] = int(self.object.total_activity / 1.97)

        return context

    def get_latest_votings(self, n):
        votes = self.object.votes.all()
        votings = (
            Voting.objects.filter(votes__in=votes).distinct().order_by("-date")[:n]
        )
        for voting in votings:
            text_vote = voting.votes.filter(MP=self.object).last().vote_label
            voting.envoy_vote = text_vote
        return votings

    def get_discipline_ratio(self):
        votes = self.object.votes.all()
        votings = Voting.objects.filter(votes__in=votes).distinct().order_by("-date")
        club = self.object.club
        voting_dict = defaultdict(int)
        for voting in votings:
            try:
                club_vote = voting.club_votes.get(club=club)
            except (ClubVote.MultipleObjectsReturned, ClubVote.DoesNotExist):
                logger.warning(f"Club vote for {voting.club_votes.filter(club=club)}")

                continue
            most_popular = (
                VoteOption.NO if club_vote.no > club_vote.yes else VoteOption.YES
            )
            envoy_vote = self.object.votes.get(voting=voting).vote
            if envoy_vote in [
                VoteOption.ABSENT,
                VoteOption.VOTE_VALID,
                VoteOption.ABSTAIN,
            ]:
                voting_dict["brak głosu"] += 1
            elif most_popular == envoy_vote:
                voting_dict["zgodnie"] += 1
            else:
                voting_dict["niezgodnie"] += 1
                logger.warning(f"envoy vote: {envoy_vote}, club vote: {club_vote}")

        return voting_dict
