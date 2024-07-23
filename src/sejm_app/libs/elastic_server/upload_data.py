from io import BytesIO

import requests
from elasticsearch import ConflictError, Elasticsearch
from elasticsearch.helpers import bulk
from elasticsearch_dsl import Document, Text, connections
from loguru import logger
from PyPDF2 import PdfReader

from sejm_app.models import PrintModel


def get_text_from_pdf_url(pdf_url):
    response = requests.get(pdf_url)
    if response.status_code == 200:
        file = BytesIO(response.content)
        pdf = PdfReader(file)
        text = ""
        for page in range(len(pdf.pages)):
            text += pdf.pages[page].extract_text()
        return text
    logger.warning(f"Failed to download {pdf_url}.: {response.status_code}")
    return None


# Define a Document subclass for the PrintModel
class PrintDocument(Document):
    id = Text()
    title = Text()
    text = Text()

    class Index:
        name = "print"


def upload_data():
    connections.create_connection(hosts=["http://localhost:9200"], alias="default")
    es = Elasticsearch("http://localhost:9200")
    PrintDocument.init()
    documents = []

    for print_model in PrintModel.objects.all()[:100]:
        text = get_text_from_pdf_url(print_model.pdf_url)
        logger.info(f"Downloading {print_model.pdf_url}")
        document = PrintDocument(
            meta={"id": print_model.id}, text=text, title=print_model.title
        )
        documents.append(document.to_dict(include_meta=True))
        try:
            es.create(
                index="print",
                id=print_model.id,
                body=document.to_dict(),
                timeout="20s",
            )
        except ConflictError:
            logger.warning(f"Document {print_model.id} already exists")
