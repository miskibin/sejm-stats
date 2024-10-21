from itertools import product
import re
from django.utils import timezone
from loguru import logger

from eli_app.libs.api_endpoints import EliAPI
from eli_app.libs.embede import embed_text
from eli_app.models import Act, ActStatus, DocumentType, Institution, Keyword, Publisher
from sejm_app.db_updater import DbUpdaterTask
from sejm_app.utils import parse_all_dates

ELI_API = EliAPI()  # Assume this is already imported from the relevant module


class ActUpdaterTask(DbUpdaterTask):
    MODEL = Act
    DATE_FIELD_NAME = "announcementDate"
    STARTING_YEAR = 2023

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

            # After creating all new acts, check if we need to create embeddings
            if new_acts:
                self.create_embeddings_for_acts(new_acts)

        # After processing all years and publishers, check for any remaining acts without embeddings
        self.create_embeddings_for_acts(Act.objects.filter(embedding__isnull=True))

    def create_embeddings_for_acts(self, acts: list[Act]):
        acts_without_embedding = [act for act in acts if not act.embedding]
        total_acts = len(acts_without_embedding)
        if not acts_without_embedding:
            logger.info("All acts already have embeddings")
            return
        logger.info(f"Creating embeddings for {total_acts} acts")

        try:
            # Prepare all titles at once
            cleaned_titles = [
                self.clean_title(act.title) for act in acts_without_embedding
            ]

            # Create embeddings for all titles at once
            logger.info(f"Creating embeddings for {total_acts} acts in batch")
            embeddings = embed_text(cleaned_titles)

            # Update acts with their embeddings
            for act, embedding in zip(acts_without_embedding, embeddings):
                act.embedding = embedding

            # Bulk update all acts
            Act.objects.bulk_update(acts_without_embedding, ["embedding"])

            logger.success(
                f"Successfully created embeddings for {total_acts} acts in batch"
            )
        except Exception as e:
            logger.error(f"Failed to create embeddings in batch: {str(e)}")

        # After batch processing, check if any acts still don't have embeddings
        remaining_acts = Act.objects.filter(embedding__isnull=True)
        if remaining_acts.exists():
            logger.warning(
                f"{remaining_acts.count()} acts still without embeddings. Processing individually."
            )
            for act in remaining_acts:
                try:
                    cleaned_title = self.clean_title(act.title)
                    embedding = embed_text([cleaned_title])[0]
                    act.embedding = embedding
                    act.save(update_fields=["embedding"])
                    logger.success(f"Created embedding for act: {act.ELI}")
                except Exception as e:
                    logger.error(
                        f"Failed to create embedding for act {act.ELI}: {str(e)}"
                    )

        logger.success("Embedding creation process completed")

    @staticmethod
    def clean_title(title):
        # Extract the authority and the rest of the title
        match = re.match(
            r"^(?:Rozporządzenie|Obwieszczenie)\s+(.*?)\s+z\s+dnia.*?(?:w sprawie|zmieniające)",
            title,
            re.IGNORECASE,
        )
        authority = match.group(1) if match else ""

        # Remove the document type, date, and "w sprawie" phrases
        title = re.sub(r"^.*?(?:z dnia \d+\s+\w+\s+\d{4}\s*r\.\s*)", "", title)
        title = re.sub(r"(?:zmieniające\s+rozporządzenie\s+)?w\s+sprawie\s+", "", title)
        title = title.replace(
            "Rzeczypospolitej Polskiej ogłoszenia jednolitego tekstu ustawy", ""
        )
        # Combine authority with cleaned title
        cleaned_title = f"{authority} {title}".strip()

        # remove this type of things with (ALPHANUMERICBIGCASENOSPACES)
        # (PLH120079)
        cleaned_title = re.sub(r"\(\w+\d+\)", "", cleaned_title)
        # Remove extra whitespace
        cleaned_title = re.sub(r"\s+", " ", cleaned_title).strip()
        patterns_to_remove = [
            r"Ministra",
            r"Marszałka Sejmu Rzeczypospolitej Polskiej",
            r"Prezesa Rady Ministrów",
            r"Rady Ministrów",
            r"ogłoszenia jednolitego tekstu",
            r"zmieniające rozporządzenie",
        ]
        for pattern in patterns_to_remove:
            cleaned_title = re.sub(pattern, "", cleaned_title)

        # Convert to lowercase
        cleaned_title = cleaned_title.lower()

        # Remove special characters and extra whitespace
        cleaned_title = re.sub(r"[^a-zA-Z0-9\s]", "", cleaned_title)
        cleaned_title = re.sub(r"\s+", " ", cleaned_title).strip()

        return cleaned_title
