import requests
from bs4 import BeautifulSoup
from loguru import logger


def extract_text(html):
    try:
        soup = BeautifulSoup(html, "html.parser")

        title = soup.find(
            "p", {"class": "TYTUAKTUprzedmiotregulacjiustawylubrozporzdzenia"}
        )
        content = soup.find(
            "p", {"class": "NIEARTTEKSTtekstnieartykuowanynppodstprawnarozplubpreambua"}
        )

        if title and content:
            return (
                title.text.replace("\n", " ").strip(),
                content.text.replace("\n", " ").strip(),
            )
        else:
            logger.error("Could not find the required elements in the HTML.")
            return None, None

    except Exception as e:
        logger.error(f"An error occurred while parsing the HTML: {e}")
        return None, None


url = "https://orka.sejm.gov.pl/proc10.nsf/uchwaly/1_u.htm"

html = requests.get(url).text
title, content = extract_text(html)


if title and content:
    print(f"Title: {title}")
    print(f"Content: {content}")
