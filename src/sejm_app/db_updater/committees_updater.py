import requests
from celery import current_app
from django.conf import settings
from django.db import transaction
from django.utils.dateparse import parse_date
from loguru import logger

from sejm_app.db_updater.db_updater_task import DbUpdaterTask
from sejm_app.libs.agenda_parser import get_prints_from_title, parse_agenda
from sejm_app.models import Club, Committee, CommitteeMember, Envoy
from sejm_app.models.committee import CommitteeSitting
from sejm_app.models.print_model import PrintModel


class CommitteeUpdaterTask(DbUpdaterTask):
    MODEL = Committee
    SKIP_BY_DEFAULT = False

    def run(self, *args, **kwargs):
        response = requests.get(f"{settings.SEJM_ROOT_URL}/committees")
        if response.status_code == 200:
            committees_data = response.json()
            for committee_data in committees_data:
                with transaction.atomic():
                    self.update_or_create_committee(committee_data)
                logger.info(f"Committee {committee_data['code']} updated")

    def update_or_create_committee(self, data):
        committee, _ = Committee.objects.update_or_create(
            code=data["code"],
            defaults={
                "name": data["name"],
                "nameGenitive": data["nameGenitive"],
                "appointmentDate": parse_date(data["appointmentDate"]),
                "compositionDate": parse_date(data["compositionDate"]),
                "phone": data.get("phone", ""),
                "scope": data.get("scope"),
                "type": data["type"],
            },
        )
        self._update_or_create_members(committee, data.get("members", []))
        self._download_sittings(committee)

    def _download_sittings(self, committee: Committee):
        response = requests.get(
            f"{settings.SEJM_ROOT_URL}/committees/{committee.code}/sittings"
        )
        if response.status_code == 200:
            sittings_data = response.json()
            for sitting_data in sittings_data:
                video = sitting_data.get("video", [None])
                video = video[0] if video else None
                resp = requests.get(f"{settings.SEJM_ROOT_URL}/videos/{video}")
                video_url = (
                    resp.json().get("videoLink") if resp.status_code == 200 else None
                )
                agenda = parse_agenda(sitting_data.get("agenda", ""))
                prints = get_prints_from_title(agenda)
                sitting, created = CommitteeSitting.objects.update_or_create(
                    num=sitting_data["num"],
                    committee=committee,
                    defaults={
                        "agenda": agenda,
                        "closed": sitting_data["closed"],
                        "date": parse_date(sitting_data["date"]),
                        "remote": sitting_data["remote"],
                        "video_url": video_url,
                    },
                )
                sitting.prints.set(
                    [
                        PrintModel.objects.filter(number=print_id).first()
                        for print_id in prints
                    ]
                )

    def _update_or_create_members(self, committee, members):
        for member_data in members:
            envoy = Envoy.objects.get(id=member_data["id"])
            CommitteeMember.objects.update_or_create(
                committee=committee,
                envoy=envoy,
                defaults={
                    "function": member_data.get("function"),
                },
            )
