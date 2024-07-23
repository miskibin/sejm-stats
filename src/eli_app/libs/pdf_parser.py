import glob
import io
import re

import PyPDF2
import pytesseract
import requests
from loguru import logger
from pdf2image import convert_from_bytes, convert_from_path
from pdfminer.high_level import extract_text


def get_pdf_authors_and_page_num(url: str) -> list:
    try:
        file = requests.get(url)
    except requests.exceptions.ChunkedEncodingError:
        logger.error("Error while downloading file")
        return [], -1
    file_like_object = io.BytesIO(file.content)
    text = _extract_text_from_pdf(file_like_object)
    return _extract_envoys(text), _get_page_number_from_bytes(file_like_object)


def get_pages_number(url: str) -> int:
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors
    except (
        requests.exceptions.HTTPError,
        requests.exceptions.ChunkedEncodingError,
    ) as e:
        logger.error(f"Error while downloading file: {e}")
        return 0
    try:
        file_like_object = io.BytesIO(response.content)
        pdf = PyPDF2.PdfReader(file_like_object)
        total_pages = len(pdf.pages)
        return total_pages
    except Exception as e:
        logger.error(f"Error while getting page number from pdf: {e}")
        return 0


def _get_page_number_from_bytes(file_like_object: io.BytesIO) -> int:
    try:
        pdf = PyPDF2.PdfReader(file_like_object)
        total_pages = len(pdf.pages)
        return total_pages
    except Exception as e:
        logger.error(f"Error while getting page number from pdf: {e}")
        return 0


def _extract_text_from_pdf(file_like_object: io.BytesIO) -> str:
    try:
        logger.debug("extracting text from pdf")
        pages = convert_from_bytes(file_like_object.read(), first_page=1, last_page=3)
        text_parts = []
        for page in pages:
            text_parts.append(pytesseract.image_to_string(page, lang="pol"))
        return "".join(text_parts)
    except Exception as e:
        logger.error(f"Error while extracting text from pdf: {e}")
        return ""


def _extract_envoys(text: str) -> list:
    # Regular expression pattern to match envoy names
    text = text.replace("\n", " ")
    pattern = r"\(-\)?\s([A-Za-zęóąśłżźćńĘÓĄŚŁŻŹĆŃ\s-]+)[.;]"
    matches = re.findall(pattern, text)
    envoys = [match.strip() for match in matches]

    return envoys
