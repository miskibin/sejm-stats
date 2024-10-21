import requests
from django.conf import settings
from django.core.files.base import ContentFile
from django.db import IntegrityError, transaction
from django.db.models import Model
from loguru import logger

from sejm_app import models
from sejm_app.libs.wikipedia_searcher import get_wikipedia_biography
from sejm_app.models.club import Club
from sejm_app.models.print_model import AdditionalPrint, PrintModel
from sejm_app.utils import parse_all_dates

from .db_updater_task import DbUpdaterTask


class PrintsUpdaterTask(DbUpdaterTask):
    # DEPENDS ON ClubUpdaterTask
    MODEL: Model = models.PrintModel
    DATE_FIELD_NAME = "documentDate"

    def run(self, *args, **kwargs):
        logger.info("Updating prints")
        self._download_prints()

    def _create_print(self, data: list, print_nmr: str):
        if isinstance(print_nmr, list):
            print_nmr = print_nmr[0]
        print_ = next((item for item in data if item["number"] == print_nmr), None)
        if not print_:
            logger.error(f"Print {print_nmr} not found in data")
            PrintModel.objects.create(
                number=print_nmr,
                title="Druk niedostępny w bazie sejmu!",
                term=settings.TERM,
                documentDate=settings.TERM_START_DATE,
                deliveryDate=settings.TERM_START_DATE,
                changeDate=settings.TERM_START_DATE,
            )
            return
        logger.info(f"Creating print {print_['number']}")
        print_ = parse_all_dates(print_)
        print_.pop("attachments")
        add_prints = []
        if (
            print_.get("processPrint")
            and (prcPrint := print_.pop("processPrint", [print_nmr])[0])
        ) and prcPrint != print_nmr:
            if not PrintModel.objects.filter(number=prcPrint).exists():
                self._create_print(data, prcPrint)
            print_["processPrint"] = PrintModel.objects.get(number=prcPrint)
        if print_.get("additionalPrints"):
            add_prints = print_.pop("additionalPrints")
        print_mdl = PrintModel.objects.create(**print_)
        for add_print in add_prints:
            if add_print.get("processPrint"):
                if not PrintModel.objects.filter(
                    number=add_print["processPrint"][0]
                ).exists():
                    self._create_print(data, add_print["processPrint"][0])
                add_print["processPrint"] = PrintModel.objects.get(
                    number=add_print.pop("processPrint")[0]
                )

            add_print.pop("attachments")
            add_print["processPrint"] = PrintModel.objects.get(
                number=add_print.pop("numberAssociated")[0]
            )
            add_print["main_print"] = print_mdl

            # Check if AdditionalPrint already exists
            if not AdditionalPrint.objects.filter(printmodel_ptr_id=add_print["printmodel_ptr_id"]).exists():
                AdditionalPrint.objects.create(**add_print)
            else:
                logger.warning(f"AdditionalPrint with printmodel_ptr_id {add_print['printmodel_ptr_id']} already exists. Skipping creation.")

    def _download_prints(self):
        url = f"{settings.SEJM_ROOT_URL}/prints"
        logger.info(f"Downloading prints from {url}")
        resp = requests.get(url)
        resp.raise_for_status()
        prints = resp.json()
        print(f"Downloaded {len(prints)} prints")
        for print_ in prints:
            if PrintModel.objects.filter(number=print_["number"]).exists():
                continue
            with transaction.atomic():
                self._create_print(prints, print_["number"])

        logger.info("Finished updating prints")