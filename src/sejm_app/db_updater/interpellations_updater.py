from itertools import count

import requests
from django.conf import settings
from django.db import transaction
from loguru import logger

from sejm_app.models import Envoy, Interpellation, Reply
from sejm_app.utils import parse_all_dates

from .db_updater_task import DbUpdaterTask


class InterpellationsUpdaterTask(DbUpdaterTask):
    MODEL = Interpellation
    DATE_FIELD_NAME = "lastModified"

    def run(self, *args, **kwargs):
        logger.info("Updating interpellations")
        self._download_interpellations()

    def _download_interpellations(self):
        url = f"{settings.SEJM_ROOT_URL}/interpellations"
        last_interpellation_num = (
            Interpellation.objects.last().num if Interpellation.objects.exists() else 0
        )
        for i in count(start=last_interpellation_num + 1):
            logger.info(f"Downloading interpellation {i}")
            if not self._process_interpellation(url, i):
                break

    def _process_interpellation(self, url, i):
        resp = requests.get(f"{url}/{i}")
        if resp.status_code != 200:
            logger.info(f"Finished downloading interpellations on {i - 1}")
            return False
        data = parse_all_dates(resp.json(), True)
        data["title"] = data["title"][:512]
        with transaction.atomic():
            self._create_or_update_interpellation(data)
        return True

    def _create_or_update_interpellation(self, data):
        envoy = self._get_envoy_from_data(data.pop("from"))
        replies_data = data.pop("replies", [])
        links = data.pop("links", [])

        interpellation, _ = Interpellation.objects.update_or_create(
            id=f"{data.get('term')}{data.get('num')}",
            defaults={
                **data,
                "fromMember": envoy,
                "bodyLink": self._get_body_link(links),
            },
        )

        for reply_data in replies_data:
            self._create_reply(interpellation, reply_data)

    def _create_reply(self, interpellation, data):
        if envoy := self._get_envoy_from_data(data.get("from")):
            data["fromMember"] = envoy
            data.pop("from")
        else:
            data["fromNotEnvoy"] = data.pop("from")
        links = data.pop("links", [])
        Reply.objects.create(
            interpellation=interpellation,
            bodyLink=self._get_body_link(links),
            **parse_all_dates(data, True),
        )

    def _get_envoy_from_data(self, envoy_data):
        try:
            if isinstance(envoy_data, list) and envoy_data[0].isdigit():
                return Envoy.objects.get(pk=envoy_data[0])
            else:
                first_name, last_name = envoy_data.split()[-2:]
                return Envoy.objects.get(
                    firstName__iexact=first_name, lastName__iexact=last_name
                )
        except Envoy.DoesNotExist:
            logger.debug(f"Envoy not found for name: {envoy_data}")
            return None

    def _get_body_link(self, links):
        for link in links:
            if link["rel"] == "body":
                return link["href"]
        return None
