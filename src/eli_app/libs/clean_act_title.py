import re


def clean_title(title):
    # Extract the authority and the rest of the title
    match = re.match(
        r"^(?:Rozporządzenie|Obwieszczenie)\s+(.*?)\s+z\s+dnia.*?(?:w sprawie|zmieniające)",
        title,
        re.IGNORECASE,
    )
    authority = match.group(1) if match else ""

    # Remove the document type, date, and "w sprawie" phrases
    title = re.sub(r"^.*?(?:z dnia \d+\s+\w+\s+\d{4}\s*r\.\s*)", "", title)
    title = re.sub(
        r"(?:zmieniające\s+rozporządzenie\s+)?w\s+sprawie\s+", "dot. ", title
    )
    title = title.replace(
        "Rzeczypospolitej Polskiej ogłoszenia jednolitego tekstu ustawy", ""
    )

    # Combine authority with cleaned title
    cleaned_title = f"{authority} {title}".strip()

    # Remove code patterns like (PLH120079)
    cleaned_title = re.sub(r"\(\w+\d+\)", "", cleaned_title)

    # Remove extra whitespace
    cleaned_title = re.sub(r"\s+", " ", cleaned_title).strip()

    # Remove specific patterns - now excluding 'Ministra' and 'Marszałka'
    patterns_to_remove = [
        r"Prezesa Rady Ministrów",
        r"Rady Ministrów",
        r"ogłoszenia jednolitego tekstu",
        r"zmieniające rozporządzenie",
        r"ustawy -",
    ]
    for pattern in patterns_to_remove:
        cleaned_title = re.sub(pattern, "", cleaned_title)

    # Final cleanup
    cleaned_title = re.sub(r"\s+", " ", cleaned_title).strip()

    return cleaned_title
