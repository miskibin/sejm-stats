import time
import requests
import pdfplumber
from itertools import product
import re
from django.utils import timezone
from loguru import logger
from pathlib import Path
from typing import List, Optional
from django.db.models import Q
from eli_app.libs.api_endpoints import EliAPI
from eli_app.libs.embede import LegalSummarizer, embed_text
from eli_app.models import Act, ActStatus, DocumentType, Institution, Keyword, Publisher
from sejm_app.db_updater import DbUpdaterTask
from sejm_app.utils import parse_all_dates

ELI_API = EliAPI()


class ActUpdaterTask(DbUpdaterTask):
    MODEL = Act
    DATE_FIELD_NAME = "announcementDate"
    STARTING_YEAR = 2020
    TEMP_PDF_PATH = Path("temp.pdf")
    EMBEDE_STATUSES = ["obowiązujący"]
    EMBEDE_PUBLISHERS = "DU"
    SUBSTRING = "sprawie ogłoszenia jednolitego tekstu"

    def should_create_embedding(self, act: Act) -> bool:
        """Check if the act meets the criteria for embedding creation"""
        return (
            act.status.name in self.EMBEDE_STATUSES
            and act.publisher.code == self.EMBEDE_PUBLISHERS
            and self.SUBSTRING.lower() in act.title.lower()
        )

    def download_and_parse_pdf(self, eli: str, max_pages=70) -> Optional[str]:
        url = f"https://api.sejm.gov.pl/eli/acts/{eli}/text.pdf"
        logger.info(f"Downloading PDF from: {url}")

        response = requests.get(url)
        with open(self.TEMP_PDF_PATH, "wb") as f:
            f.write(response.content)

        text = ""
        with pdfplumber.open(self.TEMP_PDF_PATH) as pdf:
            pages_to_process = min(len(pdf.pages), max_pages)
            logger.info(
                f"Processing {pages_to_process} pages out of {len(pdf.pages)} total pages"
            )

            for page in pdf.pages[:pages_to_process]:
                text += page.extract_text() or ""

        if self.TEMP_PDF_PATH.exists():
            self.TEMP_PDF_PATH.unlink()

        return text.strip() if text.strip() else None

    def prepare_text_for_embedding(self, title: str, summary: str) -> str:
        return f"{title}: {summary}".strip()

    def create_single_act_embedding(self, act: Act) -> bool:
        if not self.should_create_embedding(act):
            logger.debug(f"Skipping {act.ELI} - does not meet embedding criteria")
            return False

        try:
            pdf_text = self.download_and_parse_pdf(act.ELI)
            if not pdf_text:
                return False
            logger.debug(f"Downloaded {act.ELI} with len {len(pdf_text)}. Summarizing")
            summarizer = LegalSummarizer()
            summary = summarizer.generate_summary(
                summarizer.create_prompt(act.title, pdf_text)
            )
            logger.debug(f"summarized text. len: {len(summary)} ")
            embedding_text = self.prepare_text_for_embedding(act.title, summary)
            embedding = embed_text([embedding_text])[0]

            act.embedding = embedding
            act.text_length = len(pdf_text)
            act.summary = summary
            act.save(update_fields=["embedding", "text_length", "summary"])

            return True

        except Exception as e:
            logger.error(f"Failed to process act {act.ELI}: {str(e)}")
            return False

    def create_embeddings_for_acts(self, acts: list[Act]):
        # Filter acts that need embedding and meet the criteria
        acts_to_process = [
            act
            for act in acts
            if not act.embedding and self.should_create_embedding(act)
        ]

        if not acts_to_process:
            return

        logger.info(f"Processing {len(acts_to_process)} acts")

        for act in acts_to_process:
            success = self.create_single_act_embedding(act)
            if success:
                time.sleep(10)

    def run(self, *args, **kwargs):
        years = range(self.STARTING_YEAR, timezone.now().year + 1)
        publishers = Publisher.objects.all()

        for year, publisher in product(years, publishers):
            try:
                acts_count = ELI_API.list_acts(publisher.code, year)["count"]
            except TypeError:
                logger.warning(f"Publisher {publisher.name} not found")
                continue

            db_count = Act.objects.filter(publisher=publisher, year=year).count() + 1
            if acts_count == db_count:
                logger.info(f"{publisher.name} already populated")
                continue

            new_acts = []
            for act_idx in range(max(db_count, 1), acts_count + 1):
                act = ELI_API.act_details(publisher.code, year, act_idx)
                act = parse_all_dates(act, date_only=True)
                if not act:
                    logger.warning(f"Act {act_idx} not found")
                    continue
                if Act.objects.filter(ELI=act["ELI"]).exists():
                    continue

                act_status, _ = ActStatus.objects.get_or_create(name=act.pop("status"))
                document_type, _ = DocumentType.objects.get_or_create(
                    name=act.pop("type")
                )
                act.pop("publisher")
                released_by = None
                if inst := act.pop("releasedBy"):
                    released_by = Institution.objects.get(name=inst[0])

                keywords = act.pop("keywords")
                field_names = [f.name for f in Act._meta.get_fields()]
                filtered_act = {k: v for k, v in act.items() if k in field_names}
                filtered_act["title"] = filtered_act["title"][:1024]

                act_instance = Act.objects.create(
                    status=act_status,
                    type=document_type,
                    publisher=publisher,
                    releasedBy=released_by,
                    **filtered_act,
                )

                keywords_qs = Keyword.objects.filter(name__in=keywords)
                act_instance.keywords.set(keywords_qs)

                new_acts.append(act_instance)

            if new_acts:
                self.create_embeddings_for_acts(new_acts)

        # Process any remaining acts that need embeddings and meet criteria
        acts_needing_processing = Act.objects.filter(
            Q(embedding__isnull=True) | Q(summary__isnull=True)
        ).filter(
            status__name__in=self.EMBEDE_STATUSES,
            publisher__code=self.EMBEDE_PUBLISHERS,
            title__icontains=self.SUBSTRING,
        )
        self.create_embeddings_for_acts(acts_needing_processing)

