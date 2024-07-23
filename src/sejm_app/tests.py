import unittest

from django.test import TestCase

# Create your tests here.
from sejm_app.libs.agenda_parser import get_prints_from_title


class TestGetPrintsFromTitle(unittest.TestCase):
    def test_multiple_print_references(self):
        self.assertEqual(
            get_prints_from_title("Komisja o ustawie (druki nr 100, 200)"),
            ["100", "200"],
        )

    def test_single_print_reference(self):
        self.assertEqual(
            get_prints_from_title("Komisja o ustawie (druk nr 300)"), ["300"]
        )

    def test_no_print_references(self):
        self.assertEqual(
            get_prints_from_title("Komisja o ustawie bez numerów druków"), []
        )

    def test_complex_print_references(self):
        self.assertEqual(
            get_prints_from_title("Komisja o ustawie (druk nr 400-A, 401-B)"),
            ["400-A", "401-B"],
        )

    def test_mixed_content(self):
        self.assertEqual(
            get_prints_from_title(
                "Dyskusja o ustawie (druki nr 500) i innym dokumencie"
            ),
            ["500"],
        )

    def test_prints_with_varied_spacing_and_punctuation(self):
        self.assertEqual(
            get_prints_from_title("Dyskusja (druki nr 123,456-A; 789)"),
            ["123", "456-A", "789"],
        )
