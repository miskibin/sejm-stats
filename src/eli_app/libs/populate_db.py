from datetime import datetime
from functools import partial
from typing import Callable

from django.db import models
from django.db.utils import OperationalError
from django.utils import timezone
from loguru import logger

from eli_app.libs.api_endpoints import EliAPI
from eli_app.models import (
    Act,
    ActStatus,
    DocumentType,
    Institution,
    Keyword,
    Publisher,
    Reference,
)


def populate(function: Callable, model: models.Model):
    try:
        model.objects.count()
    except OperationalError:
        logger.info("Database not initialized yet")
        return
    names = function()
    if model.objects.count() == len(names):  # TODO Will never happen
        logger.info(f"{model.__name__} already populated")
        return
    for name in names:
        if not model.objects.filter(name=name).exists():
            model.objects.create(name=name)


def populate_publishers(function: Callable):
    try:
        Publisher.objects.count()
    except OperationalError:
        logger.info("Database not initialized yet")
        return
    if Publisher.objects.count() > 0:
        logger.info("Publishers already populated")
        return
    publishers = function()
    for publisher in publishers:
        if not Publisher.objects.filter(code=publisher["code"]).exists():
            Publisher.objects.create(
                actsCount=publisher["actsCount"],
                code=publisher["code"],
                name=publisher["name"],
                shortName=publisher["shortName"],
            )


def populate_acts(function: Callable):
    try:
        Act.objects.count()
    except OperationalError:
        logger.info("Database not initialized yet")
        return
    year = 2023  # TODO need to change this
    api = EliAPI()
    for publisher in Publisher.objects.all():
        try:
            acts_count = api.list_acts(publisher.code, year)["count"]
        except TypeError:
            logger.warning(f"Publisher {publisher.name} not found")
            continue
        db_count = Act.objects.filter(publisher=publisher, year=year).count() + 1
        if acts_count == db_count:
            logger.info(f"{publisher.name} already populated")
            continue
        for act_idx in range(max(db_count, 1), acts_count + 1):
            act = api.act_details(publisher.code, year, act_idx)
            if not act:
                logger.warning(f"Act {act_idx} not found")
                continue
            if Act.objects.filter(ELI=act["ELI"]).exists():
                continue
            act_instance = Act.objects.create(
                publisher=publisher,
                year=year,
                ELI=act["ELI"],
                title=act["title"][:512],
                status=ActStatus.objects.get(name=act["status"]),
                type=DocumentType.objects.get(name=act["type"]),
                releasedBy=(
                    Institution.get_by_name(act["releasedBy"][0])
                    if act.get("releasedBy")
                    else None
                ),
                changeDate=timezone.make_aware(
                    datetime.strptime(act["changeDate"], "%Y-%m-%dT%H:%M:%S")
                ),
                textHTML=act["textHTML"],
                volume=act["volume"],
                pos=act["pos"],
                announcementDate=(
                    timezone.make_aware(
                        datetime.strptime(act["announcementDate"], "%Y-%m-%d")
                    )
                    if act.get("announcementDate")
                    else None
                ),
                directives=act["directives"],
                textPDF=act["textPDF"],
                entryIntoForce=(
                    timezone.make_aware(
                        datetime.strptime(act["entryIntoForce"], "%Y-%m-%d")
                    )
                    if act.get("entryIntoForce")
                    else None
                ),
            )
            act_instance.keywords.set(Keyword.objects.filter(name__in=act["keywords"]))


populate_institutions = partial(populate, model=Institution)
populate_keywords = partial(populate, model=Keyword)
populate_statuses = partial(populate, model=ActStatus)
populate_references = partial(populate, model=Reference)
populate_documentTypes = partial(populate, model=DocumentType)


def init_db():
    api = EliAPI()
    populate_keywords(api.list_keywords)
    populate_institutions(api.list_institutions)
    populate_publishers(api.list_publishers)
    populate_statuses(api.list_statuses)
    populate_references(api.list_reference_types)
    populate_documentTypes(api.list_documentTypes)
    populate_acts(api.list_acts)
