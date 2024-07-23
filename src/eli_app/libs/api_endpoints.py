# {
#     "list_statuses": "https://api.sejm.gov.pl/eli/statuses",
#     "list_reference_types": "https://api.sejm.gov.pl/eli/references",
#     "list_document_types": "https://api.sejm.gov.pl/eli/types",
#     "list_keywords": "https://api.sejm.gov.pl/eli/keywords",
#     "list_institutions": "https://api.sejm.gov.pl/eli/institutions",
#     "list_publishers": "https://api.sejm.gov.pl/eli/acts",
#     "list_years": "https://api.sejm.gov.pl/eli/acts/{publisher}",
#     "list_acts": "https://api.sejm.gov.pl/eli/acts/{publisher}/{year}",
#     "act_details": "https://api.sejm.gov.pl/eli/acts/{publisher}/{year}/{position}",
#     "act_pdf": "https://api.sejm.gov.pl/eli/acts/{publisher}/{year}/{position}/text.pdf",
#     "act_html": "https://api.sejm.gov.pl/eli/acts/{publisher}/{year}/{position}/text.html",
#     "act_references": "https://api.sejm.gov.pl/eli/acts/{publisher}/{year}/{position}/references",
#     "search": "https://api.sejm.gov.pl/eli/acts/search",
#     "list_changed_acts": "https://api.sejm.gov.pl/eli/changes/acts?since={date}&limit={limit}&offset={offset}",
# }
from urllib.parse import urljoin

import requests
from loguru import logger
from pydantic import AnyUrl


class EliAPI:
    BASE_URL = "https://api.sejm.gov.pl/eli/"
    DEFAULT_PUBLISHER = "DU"

    def __init__(self):
        self.session = requests.Session()

    def _request(self, endpoint, **kwargs):
        url = urljoin(self.BASE_URL, endpoint)
        try:
            response = self.session.get(url, params=kwargs)
            response.raise_for_status()
            logger.info(f"Request to {url} successful")
            return response.json()
        except requests.HTTPError as http_err:
            logger.error(f"HTTP error occurred: {http_err}")
        except Exception as err:
            logger.error(f"Other error occurred: {err}")

    def list_publishers(self) -> list[str]:
        return self._request("acts")

    def list_statuses(self) -> list[str]:
        return self._request("statuses")

    def list_reference_types(self) -> list[str]:
        return self._request("references")

    def list_document_types(self) -> list[str]:
        return self._request("types")

    def list_keywords(self) -> list[str]:
        return self._request("keywords")

    def list_institutions(self) -> list[str]:
        return self._request("institutions")

    def list_years(self, publisher) -> list[str]:
        return self._request(f"acts/{publisher}")

    def list_acts(self, publisher, year) -> list[str]:
        return self._request(f"acts/{publisher}/{year}")

    def act_details(self, publisher, year, position) -> dict:
        return self._request(f"acts/{publisher}/{year}/{position}")

    def act_pdf(self, publisher, year, position) -> AnyUrl:
        return self._request(f"acts/{publisher}/{year}/{position}/text.pdf")

    def act_html(self, publisher, year, position) -> AnyUrl:
        return self._request(f"acts/{publisher}/{year}/{position}/text.html")

    # def act_references(self, publisher, year, position):
    #     return self._request(f"acts/{publisher}/{year}/{position}/references")

    # def search(self):
    #     return self._request("acts/search")

    def list_changed_acts(self, date, limit, offset) -> list:
        date_str = date.strftime("%Y-%m-%d")
        return self._request("changes/acts", since=date_str, limit=limit, offset=offset)
