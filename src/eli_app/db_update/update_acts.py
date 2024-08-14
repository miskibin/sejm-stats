from datetime import datetime
from functools import partial
from itertools import product
from typing import Callable

from django.db import OperationalError
from django.utils import timezone
from loguru import logger

from eli_app.libs.api_endpoints import EliAPI
from eli_app.models import Act, ActStatus, DocumentType, Institution, Keyword, Publisher
from sejm_app.db_updater import DbUpdaterTask
from sejm_app.utils import parse_all_dates

ELI_API = EliAPI()  # Assume this is already imported from the relevant module


class ActUpdaterTask(DbUpdaterTask):
    MODEL = Act
    DATE_FIELD_NAME = "announcementDate"
    STARTING_YEAR = 2023

    def run(self, *args, **kwargs):
        years = range(
            self.STARTING_YEAR, timezone.now().year + 1
        )  # Replace with your actual range of years
        publishers = Publisher.objects.all()

        for year, publisher in product(years, publishers):
            # Your code here
            try:
                acts_count = ELI_API.list_acts(publisher.code, year)["count"]
            except TypeError:
                logger.warning(f"Publisher {publisher.name} not found")
                continue

            db_count = Act.objects.filter(publisher=publisher, year=year).count() + 1
            if acts_count == db_count:
                logger.info(f"{publisher.name} already populated")
                continue

            for act_idx in range(max(db_count, 1), acts_count + 1):
                act = ELI_API.act_details(publisher.code, year, act_idx)
                act = parse_all_dates(act, date_only=True)
                if not act:
                    logger.warning(f"Act {act_idx} not found")
                    continue
                if Act.objects.filter(ELI=act["ELI"]).exists():
                    continue

                # Create or get the ActStatus and DocumentType
                act_status, created = ActStatus.objects.get_or_create(
                    name=act.pop("status")
                )
                document_type, created = DocumentType.objects.get_or_create(
                    name=act.pop("type")
                )
                act.pop("publisher")
                # Fetch or create the Institution
                released_by = None
                if inst := act.pop("releasedBy"):
                    released_by = Institution.objects.get(name=inst[0])

                keywords = act.pop("keywords")
                field_names = [f.name for f in Act._meta.get_fields()]
                filtered_act = {k: v for k, v in act.items() if k in field_names}
                # act title sometimes is to long
                filtered_act["title"] = filtered_act["title"][:1024]
                act_instance = Act.objects.create(
                    status=act_status,
                    type=document_type,
                    publisher=publisher,
                    releasedBy=released_by,
                    **filtered_act,
                )

                # Assign keywords to the act_instance
                keywords_qs = Keyword.objects.filter(name__in=keywords)
                act_instance.keywords.set(keywords_qs)
