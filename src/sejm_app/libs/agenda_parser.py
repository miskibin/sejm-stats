import re

from bs4 import BeautifulSoup


def parse_agenda(agenda):
    soup = BeautifulSoup(agenda, "html.parser")
    divs = soup.find_all("div")
    text_lines = [div.get_text() for div in divs]
    readable_agenda = "\n".join(text_lines)

    return readable_agenda


def get_prints_from_title(title) -> list[int]:
    titles = re.findall(r"\(druki? nr [\d,;\s\w-]+\)", title)
    print_ids = []
    for title in titles:
        ids = re.findall(r"\b\d+-?\w*\b", title)
        print_ids.extend(ids)
    return print_ids
