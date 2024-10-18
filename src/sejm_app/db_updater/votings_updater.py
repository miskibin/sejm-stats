import requests
from django.conf import settings
from django.db import transaction
from django.db.models import Model
from django.db.utils import DataError
from loguru import logger

from sejm_app import models
from sejm_app.libs.agenda_parser import get_prints_from_title
from sejm_app.models import Club, ClubVote, Vote, VoteOption, Voting
from sejm_app.models.envoy import Envoy
from sejm_app.models.vote import ListVote
from sejm_app.models.voting import VotingOption
from sejm_app.utils import parse_all_dates

from .db_updater_task import DbUpdaterTask


class VotingsUpdaterTask(DbUpdaterTask):
    MODEL: Model = models.Voting
    DATE_FIELD_NAME = "date"

    def run(self, *args, **kwargs):
        logger.info("Updating votings")

        self._download_votings()

    def _get_sitting_and_number(self):
        last_voting = (
            Voting.objects.order_by("-date").first()
            if Voting.objects.exists()
            else None
        )
        sitting, number = (
            (last_voting.sitting, last_voting.votingNumber + 1)
            if last_voting
            else (1, 1)
        )
        return sitting, number

    def _create_club_votes(self, voting: Voting):
        for club in Club.objects.all():
            if voting.club_votes.filter(club=club).exists():
                continue
            votes = Vote.objects.filter(voting=voting, MP__club=club)
            yes = votes.filter(vote=VoteOption.YES).count()
            no = votes.filter(vote=VoteOption.NO).count()
            abstain = votes.filter(
                vote__in=[VoteOption.ABSTAIN, VoteOption.ABSENT]
            ).count()
            club_vote = ClubVote.objects.create(
                club=club, voting=voting, yes=yes, no=no, abstain=abstain
            )
            club_vote.save()

    def _get_category(
        self, title, topic: str, has_prints: bool, is_on_list
    ) -> Voting.Category:
        if is_on_list:
            return Voting.Category.CANDIDATES
        if topic.lower().startswith("wniosek") and not has_prints:
            return Voting.Category.APPLICATION
        if topic.lower().startswith("głosowanie nad całością projektu") and has_prints:
            return Voting.Category.WHOLE_PROJECT
        if topic.lower().startswith("poprawk") and has_prints:
            return Voting.Category.AMENDMENT
        if has_prints:
            return Voting.Category.PRINTS
        logger.warning(f"Unknown category for voting {title} : {topic}")
        return Voting.Category.OTHER

    def _download_votings(self):
        sitting, number = self._get_sitting_and_number()
        logger.info(f"Downloading votings from {sitting} sitting")
        while number < 1000:  # 1000 is a random number, we need to stop at some point
            resp = requests.get(f"{settings.VOTINGS_URL}/{sitting}/{number}")
            logger.debug(f"Downloaded voting {sitting}/{number}: {resp.status_code}")
            if resp.status_code == 404 and number > 1:
                sitting += 1
                number = 1
                continue
            if resp.status_code == 404 or resp.json() == []:
                logger.info(f"Finished downloading votings from {sitting} sitting")
                break
            resp.raise_for_status()
            with transaction.atomic():
                voting = self._create_voting(resp.json())
                self._create_club_votes(voting)
            number += 1

    def _create_vote(self, vote_data: dict, voting: Voting) -> Vote:
        vote = Vote()
        vote.voting = voting
        vote_data = parse_all_dates(vote_data)
        vote.MP = Envoy.objects.get(id=vote_data["MP"])
        if voting.votes.filter(MP=vote.MP).exists():
            return voting.votes.get(MP=vote.MP)
        if voting.kind == Voting.Kind.ON_LIST:
            vote.save()
            for index, val in vote_data.get("listVotes", {}).items():
                list_vote = ListVote.objects.create(
                    vote=vote,
                    voteOption=VoteOption[val.upper()].value,
                    optionIndex=VotingOption.objects.get(
                        voting=voting, optionIndex=index
                    ),
                )
                list_vote.save()
            return vote
        if vote_data.get("vote"):
            vote.vote = VoteOption[vote_data["vote"].upper()].value
        return vote

    def _create_voting(self, data: dict):
        # if does not existss
        if Voting.objects.filter(
            sittingDay=data["sittingDay"],
            votingNumber=data["votingNumber"],
            sitting=data["sitting"],
        ).exists():
            return Voting.objects.filter(
                sittingDay=data["sittingDay"],
                votingNumber=data["votingNumber"],
                sitting=data["sitting"],
            ).first()
        voting = Voting()
        data = parse_all_dates(data)
        for key, value in data.items():
            if not hasattr(voting, key) or key in ("votes", "votingOptions"):
                continue
            if isinstance(value, str) and len(value) > 512:
                value = value[:512]
            setattr(voting, key, value)
        title = f"{voting.title} {voting.topic}"
        print_ids = get_prints_from_title(title)
        voting.category = self._get_category(
            voting.title,
            voting.topic if voting.topic else "",
            bool(print_ids),
            voting.kind == Voting.Kind.ON_LIST,
        )
        voting.save()
        voting.prints.set(
            [
                models.PrintModel.objects.filter(number=print_id).first()
                for print_id in print_ids
            ]
        )
        voting.save()
        if votingOptions := data.get("votingOptions"):  # only for ON_LIST votings
            for option in votingOptions:
                opt_obj = VotingOption.objects.create(
                    voting=voting,
                    option=option["option"],
                    optionIndex=option["optionIndex"],
                )
                opt_obj.save()
        if votes_data := data.get("votes"):
            try:
                voting.save()
                votes = [
                    self._create_vote(vote_data, voting) for vote_data in votes_data
                ]
                for vote in votes:
                    vote.save()
            except DataError:
                logger.warning(f"DataError: {votes_data}")
        if voting.kind == Voting.Kind.ON_LIST:
            for option in voting.votingOptions.all():
                option.votes = voting.votes.filter(
                    listVotes__optionIndex=option.optionIndex,
                    listVotes__voteOption=VoteOption.YES,
                ).count()
                option.save()
        return voting
