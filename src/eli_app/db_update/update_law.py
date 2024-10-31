import tempfile
from time import sleep
import pdfplumber
import requests
from eli_app.libs.act_sections_extractor import split_into_sections
from eli_app.libs.llm_helpers import create_prompt, prepare_section_for_embedding
from eli_app.libs.run_llms import generate_summary, embed_texts_in_chunks
from eli_app.models import Act, ActSection
from sejm_app.db_updater.db_updater_task import DbUpdaterTask
from loguru import logger


class ActSectionUpdaterTask(DbUpdaterTask):
    MODEL = ActSection
    SKIP_BY_DEFAULT = True

    def run(self, *args, **kwargs):
        elis_to_process = [
            "DU/2023/2151",  # ALKOHOL
            "DU/2024/1061",  # KODEKS CYWILNY
            "DU/2024/17",  # KODEKS KARNY
        ]
        self.process_legal_documents(elis_to_process)
        self.process_sections_without_embeddings()

    def process_legal_documents(self, elis: list[str]):
        for eli in elis:
            try:
                logger.info(f"Processing ELI: {eli}")
                metadata, full_text = self.fetch_metadata_and_text(eli)
                chapters = split_into_sections(full_text)
                self.process_chapters(eli, chapters, metadata)
                logger.success(f"Completed processing: {eli}")
            except Exception as e:
                logger.error(f"Error processing {eli}: {str(e)}")

    def fetch_metadata_and_text(self, eli: str):
        metadata = requests.get(f"https://api.sejm.gov.pl/eli/acts/{eli}/").json()
        response = requests.get(f"https://api.sejm.gov.pl/eli/acts/{eli}/text.pdf")
        response.raise_for_status()

        with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as temp_pdf:
            temp_pdf.write(response.content)
            with pdfplumber.open(temp_pdf.name) as pdf:
                full_text = "".join(page.extract_text() or "" for page in pdf.pages)

        return metadata, full_text

    def process_chapters(self, eli: str, chapters: list[ActSection], metadata: dict):
        for chapter in chapters:
            if self.should_skip_section(eli, chapter):
                logger.info(
                    f"Skipping section {chapter.chapters} as it already has a summary"
                )
                continue

            doc_metadata = {
                "doc_title": metadata.get("title", ""),
                "keywords": metadata.get("keywords", []),
                "section_title": chapter.chapters,
            }

            summary = generate_summary(create_prompt(chapter.content, doc_metadata))

            ActSection.objects.update_or_create(
                act=Act.objects.get(ELI=eli),
                start_char=chapter.start_char,
                end_char=chapter.end_char,
                chapters=chapter.chapters,
                defaults={
                    "content": chapter.content,
                    "summary": summary,
                },
            )
            sleep(8)
            logger.info(f"Updated section {chapter.chapters}")

    def should_skip_section(self, eli: str, chapter: ActSection) -> bool:
        existing_section = ActSection.objects.filter(
            act=Act.objects.get(ELI=eli),
            start_char=chapter.start_char,
            end_char=chapter.end_char,
        ).first()
        return existing_section and existing_section.summary

    def process_sections_without_embeddings(self):
        sections_without_embeddings = ActSection.objects.filter(embedding__isnull=True)
        if not sections_without_embeddings.exists():
            logger.info("No sections without embeddings found.")
            return

        logger.info(
            f"Found {sections_without_embeddings.count()} sections without embeddings."
        )
        texts = [prepare_section_for_embedding(section) for section in sections_without_embeddings]
        embeddings = embed_texts_in_chunks(texts)

        for section, embedding in zip(sections_without_embeddings, embeddings):
            section.embedding = (
                embedding.tolist()
            )  # Assuming embedding is a JSONField or similar
            section.save()
            logger.info(f"Updated embeddings for section {section.pk}")
