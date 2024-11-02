import re
from loguru import logger

from eli_app.models import ActSection

# from typing import TypedDict


# class ActSection(TypedDict):
#     chapters: str
#     content: str
#     start_char: int
#     end_char: int


def find_document_start(text: str) -> int | None:
    """Find the starting position of actual document content."""
    starting_patterns = [
        r"ROZPORZĄDZENIE\s+MINISTR",  # Handle cases like "MINISTRA", "MINISTRÓW"
        r"USTAWA\s+z\s+dnia",
    ]
    for pattern in starting_patterns:
        pattern = r"\s*".join(pattern.split())  # Make whitespace flexible
        if match := re.search(pattern, text, re.MULTILINE):
            logger.info(
                f"Found document start with pattern '{pattern}' at position {match.start()}"
            )
            return match.start()
    logger.warning("No document start pattern found")
    return None


def get_hierarchical_sections(text: str, start_pos: int) -> list[dict]:
    """Get all sections with their hierarchical level and position."""
    # Negative lookahead to exclude citations/references
    exclusion_pattern = r"(?!\s*\(zawierający|\s*\(uchylony|\s*\(art\.)"

    patterns = {
        "tytul": rf"TYTUŁ\s+[IVXLC]+{exclusion_pattern}\.?\s*([^\n]+)",
        "dzial": rf"DZIAŁ\s+[IVXLC]+{exclusion_pattern}\.?\s*([^\n]+)",
        "rozdzial": rf"Rozdział\s+(?:\d+|[IVXLC]+){exclusion_pattern}\.?\s*([^\n]+)",
    }

    sections = []
    for level, pattern in patterns.items():
        matches = list(re.finditer(pattern, text))
        for match in matches:
            # Additional verification that it's not a citation
            title = match.group(1).strip()
            if any(x in title for x in ["(zawierający", "(uchylony", "(art."]):
                logger.debug(f"Skipping citation/reference: {title}")
                continue

            section = {
                "level": level,
                "title": title,
                "start": start_pos + match.start(),
                "end": start_pos + match.end(),
                "match_text": match.group(0),
            }
            sections.append(section)
            logger.debug(
                f"Found {level}: '{section['title']}' at position {section['start']}"
            )

    sorted_sections = sorted(sections, key=lambda x: x["start"])
    logger.info(f"Found total {len(sorted_sections)} sections")
    return sorted_sections


def create_section_title(sections: list[dict], current_idx: int) -> str:
    """Create hierarchical title based on current and parent sections."""
    current = sections[current_idx]

    # Find all sections at the same level up to the current one
    same_level_sections = []
    parent_title = None
    parent_dzial = None

    for prev in reversed(sections[: current_idx + 1]):
        # Collect sections of the same level
        if prev["level"] == current["level"]:
            same_level_sections.insert(0, prev["title"])

        # Find closest parent title for dzial and rozdzial
        if prev["level"] == "tytul" and current["level"] in ["dzial", "rozdzial"]:
            parent_title = prev["title"]
            break

    # For rozdzial, find parent dzial after finding parent title
    if current["level"] == "rozdzial" and parent_title:
        for prev in reversed(sections[:current_idx]):
            if prev["level"] == "dzial":
                parent_dzial = prev["title"]
                break

    # Build the hierarchical title
    parts = []
    if parent_title:
        parts.append(f"  {parent_title}")
    if parent_dzial and current["level"] == "rozdzial":
        parts.append(f"Dział: {parent_dzial}")

    # Add current level sections
    current_level = (
        f"{current['level'].capitalize()}: {' | '.join(same_level_sections)}"
    )
    parts.append(current_level)

    return " -> ".join(parts)


def process_section_content(
    sections: list[dict], text: str, start_pos: int
) -> list[ActSection]:
    """Process sections and their content with minimum section size of 5000 characters."""
    result = []
    text_length = len(text)
    MIN_SECTION_SIZE = 5000

    logger.info(f"Processing {len(sections)} sections")

    i = 0
    while i < len(sections):
        current = sections[i]
        combined_sections = [current]
        combined_content_start = current["start"] - start_pos

        # Determine initial section end
        if i < len(sections) - 1:
            content_end = sections[i + 1]["start"] - start_pos
        else:
            content_end = text_length

        content = text[combined_content_start:content_end]
        current_size = len(content)

        # If content is smaller than minimum size and not the last section,
        # try to combine with next sections
        while current_size < MIN_SECTION_SIZE and i < len(sections) - 1:
            i += 1
            next_section = sections[i]
            combined_sections.append(next_section)

            # Determine next section end
            if i < len(sections) - 1:
                next_end = sections[i + 1]["start"] - start_pos
            else:
                next_end = text_length

            # Update content and size
            content = text[combined_content_start:next_end]
            current_size = len(content)

        # Create combined title based on section levels
        def get_base_hierarchy(section):
            """Get the base hierarchy level (tytuł/dział) for a section."""
            if section["level"] == "tytul":
                return "tytul"
            elif section["level"] == "dzial":
                return "dzial"
            else:  # rozdzial
                return "rozdzial"

        # Group sections by their base hierarchy
        current_group = []
        grouped_titles = []
        base_level = get_base_hierarchy(combined_sections[0])

        for section in combined_sections:
            section_level = get_base_hierarchy(section)
            if section_level != base_level:
                if current_group:
                    title_parts = [s["title"] for s in current_group]
                    grouped_titles.append(" | ".join(title_parts))
                    current_group = []
                base_level = section_level
            current_group.append(section)

        # Add the last group
        if current_group:
            title_parts = [s["title"] for s in current_group]
            grouped_titles.append(" | ".join(title_parts))

        # Create the final combined title
        if len(grouped_titles) > 1:
            combined_title = " -> ".join(grouped_titles)
        else:
            combined_title = grouped_titles[0]

        # Handle large sections
        if current_size > 15000:
            logger.info(
                f"Splitting large section '{combined_title}' of {current_size} chars"
            )
            chunks = create_paginated_sections(
                combined_title, content, combined_sections[0]["start"]
            )
            result.extend(chunks)
        else:
            result.append(
                ActSection(
                    chapters=combined_title,
                    content=content,
                    start_char=combined_sections[0]["start"],
                    end_char=combined_sections[0]["start"] + len(content),
                )
            )
            logger.debug(f"Added section '{combined_title}' with {current_size} chars")

        i += 1

    return result


def split_into_sections(text: str) -> list[ActSection]:
    """Split document into hierarchical sections."""
    logger.info(f"Processing document of length {len(text)}")

    if not (start_pos := find_document_start(text)):
        logger.warning("No document start found, returning whole text as one section")
        return [
            ActSection(
                chapters="Dokument", content=text, start_char=0, end_char=len(text)
            )
        ]

    # Get actual document content
    text = text[start_pos:]
    logger.info(f"Document content length after start: {len(text)}")

    # Get all sections
    sections = get_hierarchical_sections(text, start_pos)

    if not sections:
        logger.warning("No sections found, paginating whole document")
        return create_paginated_sections("Dokument", text, start_pos)

    # Process sections and their content
    result = process_section_content(sections, text, start_pos)
    logger.info(f"Created {len(result)} final sections")
    #  get only sections longer then 250 characters

    return result


def create_paginated_sections(
    title: str, content: str, start_pos: int
) -> list[ActSection]:
    """Create paginated sections for large content."""
    chunk_size = 15000
    total_pages = (len(content) + chunk_size - 1) // chunk_size

    result = []
    current_pos = 0
    page_num = 1

    while current_pos < len(content):
        logger.info(f"Processing chunk starting at position {current_pos}")

        # Calculate remaining content size
        remaining_size = len(content) - current_pos
        current_chunk_size = min(chunk_size, remaining_size)

        next_chunk = content[current_pos : current_pos + current_chunk_size]

        # Only try to find split points if we're not at the end
        if current_pos + current_chunk_size < len(content):
            # Look for split points in the current chunk
            split_found = False

            # Try to split at the start of a new article
            last_article_start = next_chunk.rfind("Art. ")
            if last_article_start > 0:  # Ensure we're not at the start of the chunk
                logger.info(
                    f"Splitting at new article start at position {last_article_start}"
                )
                next_chunk = next_chunk[:last_article_start]
                split_found = True

            # If no article start found, try splitting at newline
            if not split_found:
                last_space = next_chunk.rfind("\n")
                if last_space > 0:  # Ensure we're not at the start of the chunk
                    logger.info(f"Splitting at last line end at position {last_space}")
                    next_chunk = next_chunk[:last_space]
                    split_found = True

            # If no suitable split point found, use the full chunk
            if not split_found:
                logger.warning("No suitable split point found, using full chunk size")

        # Ensure we're not creating an empty chunk
        if len(next_chunk) == 0:
            logger.warning("Empty chunk detected, using minimum content")
            next_chunk = content[current_pos : current_pos + min(1000, remaining_size)]

        chunk_title = (
            f"{title} (Część {page_num}/{total_pages})" if total_pages > 1 else title
        )

        result.append(
            ActSection(
                chapters=chunk_title,
                content=next_chunk,
                start_char=start_pos + current_pos,
                end_char=start_pos + current_pos + len(next_chunk),
            )
        )

        logger.info(f"Added section '{chunk_title}' with {len(next_chunk)} chars")

        # Move position by the length of the processed chunk
        current_pos += len(next_chunk)
        page_num += 1

        # Additional safety check
        if len(next_chunk) == 0:
            logger.error(
                f"Empty chunk detected at position {current_pos}, stopping pagination"
            )
            break

        # Ensure we're making progress
        if current_pos >= len(content):
            break

    return result


if __name__ == "__main__":
    import pdfplumber
    from pathlib import Path

    path = Path(__file__).parent.parent / "tests" / "1539.pdf"
    with pdfplumber.open(path) as pdf:
        text = "".join(page.extract_text() or "" for page in pdf.pages)

    sections = split_into_sections(text)
    for section in sections:
        print(section["chapters"])
        print(len(section["content"]))
        print(section["content"][:100])
        print()
        print("-" * 80)
        print()
    print(f"Total sections: {len(sections)}")
    print(f"Total characters: {sum(len(s["content"]) for s in sections)}")
    print(f"Total pages: {sum(s["content"].count('\n') for s in sections) + 1}")
