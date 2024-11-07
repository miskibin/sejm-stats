import os
from pathlib import Path
from django.test import TestCase
import pdfplumber
from typing import Dict, Tuple

from eli_app.libs.get_article import get_article


class ArticleExtractionTests(TestCase):
    # Test data structure: filepath -> (article_number, expected_length)
    dataPath = Path(__file__).parent / "files"
    TEST_PDFS: Dict[str, Dict[str, int]] = {
        dataPath
        / "ustawa_o_policji.pdf": {
            "14": 3472,  # Approximate length of Art. 14
            "15": 12619,  # Approximate length of Art. 15
            "15aa": 1018,  # Approximate length of Art. 15aa
        },
        # dataPath
        # / "kpa.pdf": {
        #     "6": 320,  # Example length for KPA Art. 6
        #     "7": 280,  # Example length for KPA Art. 7
        #     "8": 450,  # Example length for KPA Art. 8
        # },
    }

    def load_pdf_content(self, pdf_path: str) -> str:
        """Load and extract text content from a PDF file."""
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"Test PDF not found: {pdf_path}")

        text_content = []
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text_content.append(page.extract_text())

        return "\n".join(text_content)

    def test_pdf_files_exist(self):
        """Verify that all test PDF files exist."""
        for pdf_path in self.TEST_PDFS.keys():
            self.assertTrue(
                os.path.exists(pdf_path), f"Test PDF file not found: {pdf_path}"
            )

    def test_article_extraction_from_pdfs(self):
        """Test article extraction from each PDF file."""
        for pdf_path, test_cases in self.TEST_PDFS.items():
            with self.subTest(pdf_path=pdf_path):
                try:
                    # Load PDF content
                    content = self.load_pdf_content(pdf_path)
                    self.assertIsNotNone(content, "PDF content should not be None")
                    self.assertTrue(len(content) > 0, "PDF content should not be empty")

                    # Test each article extraction
                    for article_number, expected_length in test_cases.items():
                        with self.subTest(article_number=article_number):
                            article_content = get_article(content, article_number)

                            # Basic checks
                            self.assertIsNotNone(
                                article_content,
                                f"Article {article_number} not found in {pdf_path}",
                            )

                            # Check article starts correctly
                            self.assertTrue(
                                article_content.strip().startswith(
                                    f"Art. {article_number}"
                                ),
                                f"Article {article_number} doesn't start correctly",
                            )

                            # Check content length is within expected range (±10%)
                            content_length = len(article_content)
                            expected_min = expected_length * 0.98
                            expected_max = expected_length * 1.02

                            self.assertTrue(
                                expected_min <= content_length <= expected_max,
                                f"Article {article_number} length ({content_length}) is outside "
                                f"expected range ({expected_min:.0f}-{expected_max:.0f})",
                            )

                except Exception as e:
                    self.fail(f"Error processing {pdf_path}: {str(e)}")

    def test_article_not_found(self):
        """Test behavior when article is not found."""
        for pdf_path in self.TEST_PDFS.keys():
            with self.subTest(pdf_path=pdf_path):
                content = self.load_pdf_content(pdf_path)
                non_existent_article = "999999"

                result = get_article(content, non_existent_article)
                self.assertIsNone(
                    result,
                    f"Should return None for non-existent article {non_existent_article}",
                )

    def test_malformed_input(self):
        """Test handling of malformed input."""
        test_cases = [
            "",  # Empty string
            "No article",  # No articles
            "Art. ",  # Incomplete article
            "\n\n\nArt.",  # Just newlines and partial article
        ]

        for test_case in test_cases:
            with self.subTest(input=test_case):
                result = get_article(test_case, "1")
                self.assertIsNone(
                    result, f"Should return None for malformed input: {test_case}"
                )

    def test_article_number_formats(self):
        """Test different article number formats."""
        test_content = """
        Art. 1. First article
        Art. 2a. Article with letter
        Art. 3aa. Article with two letters
        Art. 4-5. Range article
        """

        test_cases = [
            ("1", True),  # Basic number
            ("2a", True),  # Number with letter
            ("3aa", True),  # Number with two letters
            ("4-5", True),  # Range format
            ("2A", False),  # Wrong case
            ("3AA", False),  # Wrong case
            ("6", False),  # Non-existent
        ]

        for article_number, should_find in test_cases:
            with self.subTest(article_number=article_number):
                result = get_article(test_content, article_number)
                if should_find:
                    self.assertIsNotNone(result)
                    self.assertTrue(result.strip().startswith(f"Art. {article_number}"))
                else:
                    self.assertIsNone(result)
