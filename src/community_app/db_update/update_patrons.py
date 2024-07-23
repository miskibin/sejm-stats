import re

import requests
from django.conf import settings
from django.db.models import Model
from loguru import logger

from community_app.models import TeamMember
from sejm_app.db_updater.db_updater_task import DbUpdaterTask

ILLEGAL_WORDS = ("śmierć",)


class PatronsUpdaterTask(DbUpdaterTask):
    MODEL: Model = TeamMember

    def run(self, *args, **kwargs):
        logger.info("Updating patrons")
        self._download_patrons()

    def clean_nickname(self, text):
        """
        This function replaces profane words in the text with asterisks.
        """
        regex_pattern = r"\b(" + "|".join(map(re.escape, ILLEGAL_WORDS)) + r")\b"
        clean_text = re.sub(
            regex_pattern, lambda x: "*" * len(x.group()), text, flags=re.IGNORECASE
        )
        return clean_text

    def _download_patrons(self):
        url = settings.PATRONITE_API_URL + "patrons/active"
        logger.debug(f"Downloading patrons from {url}")
        headers = {
            "Authorization": f"token {settings.PATRONITE_API_TOKEN}",
            "Content-Type": "application/json",
        }
        logger.debug(f"Headers: {headers}")
        response = requests.get(url, headers=headers).json()
        # remove all patrons
        self.MODEL.objects.filter(
            role__in=[TeamMember.Role.SUPPORTER, TeamMember.Role.SUPPORTER_SMALL]
        ).delete()
        for patron in response["results"]:
            if patron["isAnonymous"] or patron["amount"] == 5:
                continue
            role = (
                TeamMember.Role.SUPPORTER_SMALL
                if patron["amount"] > 10
                else TeamMember.Role.SUPPORTER
            )
            name = self.clean_nickname(patron["name"])
            self.MODEL.objects.create(
                name=name,
                role=role,
                since=patron["firstPaymentAt"][:7],  # 2024-05-13 12:27:17
            )
