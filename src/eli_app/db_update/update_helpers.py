"""
It could be all moved to one function with different parameters, but this way i have more
control over the process and can easily add more tasks in the future.
"""

from loguru import logger

from eli_app.libs.api_endpoints import EliAPI
from eli_app.models import (
    ActStatus,
    DocumentType,
    Institution,
    Keyword,
    Publisher,
    Reference,
)
from sejm_app.db_updater import DbUpdaterTask

# Initialize the API once at the module level to be reused across all classes
ELI_API = EliAPI()


class ActStatusUpdaterTask(DbUpdaterTask):
    MODEL = ActStatus
    SKIP_BY_DEFAULT = True

    def run(self, *args, **kwargs):
        statuses = ELI_API.list_statuses()
        for status_name in statuses:
            if not self.MODEL.objects.filter(name=status_name).exists():
                self.MODEL.objects.create(name=status_name)
        logger.info(f"ActStatus updated with {len(statuses)} entries.")


class InstitutionUpdaterTask(DbUpdaterTask):
    MODEL = Institution
    SKIP_BY_DEFAULT = True

    def run(self, *args, **kwargs):
        institutions = ELI_API.list_institutions()
        for institution_name in institutions:
            if not self.MODEL.objects.filter(name=institution_name).exists():
                self.MODEL.objects.create(name=institution_name)
        logger.info(f"Institution updated with {len(institutions)} entries.")


class KeywordUpdaterTask(DbUpdaterTask):
    MODEL = Keyword
    SKIP_BY_DEFAULT = True

    def run(self, *args, **kwargs):
        keywords = ELI_API.list_keywords()
        for keyword_name in keywords:
            if not self.MODEL.objects.filter(name=keyword_name).exists():
                self.MODEL.objects.create(name=keyword_name)
        logger.info(f"Keyword updated with {len(keywords)} entries.")


class PublisherUpdaterTask(DbUpdaterTask):
    MODEL = Publisher
    SKIP_BY_DEFAULT = True

    def run(self, *args, **kwargs):
        publishers = ELI_API.list_publishers()
        for publisher_data in publishers:
            if not self.MODEL.objects.filter(code=publisher_data["code"]).exists():
                self.MODEL.objects.create(
                    actsCount=publisher_data["actsCount"],
                    code=publisher_data["code"],
                    name=publisher_data["name"],
                    shortName=publisher_data["shortName"],
                )
        logger.info(f"Publisher updated with {len(publishers)} entries.")


class ReferenceUpdaterTask(DbUpdaterTask):
    MODEL = Reference
    SKIP_BY_DEFAULT = True

    def run(self, *args, **kwargs):
        references = ELI_API.list_reference_types()
        for reference_name in references:
            if not self.MODEL.objects.filter(name=reference_name).exists():
                self.MODEL.objects.create(name=reference_name)
        logger.info(f"Reference updated with {len(references)} entries.")


class DocumentTypeUpdaterTask(DbUpdaterTask):
    MODEL = DocumentType
    SKIP_BY_DEFAULT = True

    def run(self, *args, **kwargs):
        document_types = ELI_API.list_documentTypes()
        for document_type_name in document_types:
            if not self.MODEL.objects.filter(name=document_type_name).exists():
                self.MODEL.objects.create(name=document_type_name)
        logger.info(f"DocumentType updated with {len(document_types)} entries.")
