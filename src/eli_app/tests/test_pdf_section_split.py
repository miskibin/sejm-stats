from django.test import TestCase
from pathlib import Path
import pdfplumber
from eli_app.libs.act_sections_extractor import split_into_sections
from eli_app.models import ActSection


class ActSectionsExtractorTest(TestCase):
    def setUp(self):
        # Load sample text from a PDF file for testing
        path = Path(__file__).parent / "text.pdf"
        with pdfplumber.open(path) as pdf:
            self.sample_text = "".join(page.extract_text() or "" for page in pdf.pages)

    def test_section_content_length(self):
        sections = split_into_sections(self.sample_text)
        for section in sections:
            content_length = len(section.content)
            self.assertTrue(
                4000 < content_length < 16000,
                f"Section content length {content_length} is not within the expected range (4000, 16000)",
            )

    def test_total_sections(self):
        sections = split_into_sections(self.sample_text)
        total_sections = len(sections)
        self.assertGreater(total_sections, 0, "No sections were created")

    def test_total_characters(self):
        sections = split_into_sections(self.sample_text)
        total_characters = sum(len(section.content) for section in sections)
        self.assertGreater(
            total_characters, 0, "Total characters should be greater than 0"
        )
