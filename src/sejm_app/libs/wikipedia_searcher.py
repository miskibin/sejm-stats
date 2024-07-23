import wikipedia
from loguru import logger


def get_wikipedia_biography(envoy: str, with_source: bool = False) -> str:
    wikipedia.set_lang("pl")
    logger.debug(f"Searching for: {envoy}")
    search_results = wikipedia.search(envoy)
    first, last = envoy.split(" ")[1], envoy.split(" ")[-1]
    page_name = search_results[0]
    for result in search_results:
        if (
            first.lower() in result.lower()
            and last.lower() in result.lower()
            and (
                "polityk" in result.lower()
                or "poseł" in result.lower()
                or "posłanka" in result.lower()
            )
        ):
            page_name = result
            break
    logger.debug(f"Found page: {page_name}")
    try:
        if (
            not first.lower() in page_name.lower()
            or not last.lower() in page_name.lower()
        ):
            raise ValueError(f"Found invalid page")
        res = wikipedia.page(page_name)
    except (wikipedia.exceptions.DisambiguationError, ValueError) as e:
        logger.error(f"DisambiguationError: {e} ")
        return "Zbyt wiele wyników, nie udało się znaleźć biografii", ""
    biography = res.section("Życiorys")

    if not biography:
        biography = res.summary if res.summary else "-"
    if with_source:
        return biography, res.url
    logger.debug(f"biography: {biography[:10]}")
    return biography


# wikipedia.set_lang("pl")
# res = wikipedia.search("Poseł Krystian Łuczak")
# print(res)
