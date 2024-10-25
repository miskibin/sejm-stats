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
    STARTING_YEAR = 2023
    TEMP_PDF_PATH = Path("temp.pdf")

    def download_and_parse_pdf(self, eli: str, max_pages=40) -> Optional[str]:
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
        cleaned_title = self.clean_title(title)
        return f"{cleaned_title}: {summary}".strip()

    def create_single_act_embedding(self, act: Act) -> bool:
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
            embedding = embed_text([embedding_text])

            act.embedding = embedding
            act.text_length = len(pdf_text)
            act.summary = summary
            act.save(update_fields=["embedding", "text_length", "summary"])

            return True

        except Exception as e:
            logger.error(f"Failed to process act {act.ELI}: {str(e)}")
            return False

    def create_embeddings_for_acts(self, acts: list[Act]):
        acts_without_embedding = [act for act in acts if not act.embedding]
        if not acts_without_embedding:
            return

        logger.info(f"Processing {len(acts_without_embedding)} acts")

        for act in acts_without_embedding:
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
        acts_needing_processing = Act.objects.filter(
            Q(embedding__isnull=True) | Q(summary__isnull=True)
        )
        self.create_embeddings_for_acts(acts_needing_processing)

    @staticmethod
    def clean_court_ruling(title):
        court_match = re.match(
            r"^Wyrok\s+(.*?)\s+z\s+dnia\s+(\d+\s+\w+\s+\d{4})\s*r\.\s*sygn\.*(.*?)$",
            title,
            re.IGNORECASE,
        )

        if court_match:
            court = court_match.group(1)
            case_number = court_match.group(3)
            cleaned = f"Wyrok {court} - {case_number}"
            return cleaned
        return title

    @staticmethod
    def clean_regulation(title):
        match = re.match(
            r"^(?:Rozporządzenie|Obwieszczenie)\s+(.*?)\s+z\s+dnia.*?(?:w sprawie|zmieniające)",
            title,
            re.IGNORECASE,
        )
        authority = match.group(1) if match else ""

        title = re.sub(r"^.*?(?:z dnia \d+\s+\w+\s+\d{4}\s*r\.\s*)", "", title)
        title = re.sub(
            r"(?:zmieniające\s+rozporządzenie\s+)?w\s+sprawie\s+", "dot. ", title
        )
        title = title.replace(
            "Rzeczypospolitej Polskiej ogłoszenia jednolitego tekstu ustawy", ""
        )

        cleaned_title = f"{authority} {title}".strip()
        cleaned_title = re.sub(r"\(\w+\d+\)", "", cleaned_title)
        cleaned_title = re.sub(r"\s+", " ", cleaned_title).strip()

        patterns_to_remove = [
            r"Prezesa Rady Ministrów",
            r"Rady Ministrów",
            r"ogłoszenia jednolitego tekstu",
            r"zmieniające rozporządzenie",
        ]
        for pattern in patterns_to_remove:
            cleaned_title = re.sub(pattern, "", cleaned_title)

        cleaned_title = re.sub(r"\s+", " ", cleaned_title).strip()

        return cleaned_title

    @staticmethod
    def clean_title(title):
        if "wyrok" in title.lower():
            cleaned = ActUpdaterTask.clean_court_ruling(title)
        else:
            cleaned = ActUpdaterTask.clean_regulation(title)
        return cleaned if len(cleaned) > 45 else title
