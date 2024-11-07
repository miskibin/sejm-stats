from eli_app.models import Act, ActSection


def get_article(act_text: str, article_number: str) -> str | None:
    """
    Extract specific article content from a legal text.

    Args:
        act_text (str): The full text of the legal act
        article_number (str): The article number to find (e.g., "14", "15aa")

    Returns:
        str | None: The content of the article if found, None otherwise
    """
    # Clean up the text first
    act_text = act_text.strip().replace("\n\n\n", "\n").replace("\n\n", "\n")

    # Split text into articles using regex pattern
    import re

    articles = re.split(r"(?=Art\.\s*\d+[a-zA-Z]?[a-zA-Z0-9]*\.)", act_text)

    # Find the matching article
    pattern = f"Art\\.\\s*{article_number}\\b"
    matching_article = None

    for article in articles:
        if re.match(pattern, article.strip()):
            matching_article = article.strip()
            break

    return matching_article


def get_article_from_act_number(eli: str, article_number: str) -> str | None:
    act = Act.objects.get(ELI=eli)
    sections = ActSection.objects.filter(act=act)
    act_text = "\n".join([section.content for section in sections])
    # Extract the article content
    return get_article(act_text, article_number)


# Example usage:
if __name__ == "__main__":
    example_text = """Rozdział 3
    Zakres uprawnień Policji
    Art. 14. 1. W granicach swych zadań Policja wykonuje czynności: operacyjno-rozpoznawcze, dochodzeniowo-śledcze
    i administracyjno-porządkowe w celu:
    1) rozpoznawania, zapobiegania i wykrywania przestępstw;
    2) poszukiwania osób ukrywających się przed organami ścigania.
    
    Art. 15. 1. Policjanci wykonując czynności, mają prawo:
    1) legitymowania osób w celu ustalenia ich tożsamości;
    2) zatrzymywania osób.
    
    Art. 15aa. 1. Policjant ma prawo wydać nakaz."""

    # Test the function
    article_14 = get_article(example_text, "14")
    print("Article 14:", article_14)

    article_15 = get_article(example_text, "15")
    print("Article 15:", article_15)

    article_15aa = get_article(example_text, "15aa")
    print("Article 15aa:", article_15aa)
