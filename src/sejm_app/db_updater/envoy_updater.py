from pathlib import Path

import requests
from django.conf import settings
from django.core.files.base import ContentFile
from django.db import transaction
from django.db.models import Model
from loguru import logger

from sejm_app import models
from sejm_app.libs.wikipedia_searcher import get_wikipedia_biography
from sejm_app.models.club import Club

from .db_updater_task import DbUpdaterTask


class EnvoyUpdaterTask(DbUpdaterTask):
    # DEPENDS ON ClubUpdaterTask
    MODEL: Model = models.Envoy
    SKIP_BY_DEFAULT = False

    def run(self, *args, **kwargs):
        logger.info("Updating envoys")
        self._download_envoys()

    def _download_photo(self, envoy: models.Envoy):
        if envoy.photo:
            return
        dir = self.MODEL._meta.get_field("photo").upload_to
        if (Path(dir) / f"{str(envoy.id)}.jpg").exists():
            photo_file = ContentFile((Path(dir) / f"{envoy.id}.jpg").read_bytes())
            envoy.photo.save(f"{envoy.id}.jpg", photo_file)
            envoy.save()
            return
        photo_url = f"{settings.ENVOYS_URL}/{envoy.id}/photo"
        photo = requests.get(photo_url)
        logger.info(f"Downloading photo for {envoy.id}")
        if photo.status_code == 200:
            photo_file = ContentFile(photo.content)
            envoy.photo.save(f"{envoy.id}.jpg", photo_file)
            envoy.save()
        else:
            logger.warning(f"Photo for {envoy.id} not found")

    def _download_biography(self, envoy: models.Envoy):
        if envoy.biography:
            return
        biography, source = get_wikipedia_biography(envoy.title, with_source=True)
        envoy.biography = biography
        envoy.biography_source = source
        envoy.save()

    def is_female(self, e: models.Envoy) -> bool:
        return e.firstName.endswith("a")

    def _download_envoys(self):
        logger.info(f"Calling {settings.ENVOYS_URL}")
        envoys = requests.get(settings.ENVOYS_URL).json()
        for envoy in envoys:
            envoy.pop("firstLastName", None)
            envoy.pop("genitiveName", None)
            envoy.pop("accusativeName", None)
            envoy.pop("lastFirstName", None)
            envoy["club"] = Club.objects.get(id=envoy["club"])
            if not self.MODEL.objects.filter(id=envoy["id"]).exists():
                envoy_model = self.MODEL.objects.create(**envoy)
                with transaction.atomic():
                    self._download_biography(envoy_model)
                    self._download_photo(envoy_model)
                    envoy_model.isFemale = self.is_female(envoy_model)
                    envoy_model.save()
            else:
                envoy_model = self.MODEL.objects.get(id=envoy["id"])
                for key, value in envoy.items():
                    setattr(envoy_model, key, value)
                    self._download_biography(envoy_model)
                envoy_model.save()
