from vertexai.preview.prompts import Prompt

import re

from eli_app.libs.clean_act_title import clean_title
from eli_app.models import ActSection


def split_texts(texts, max_chars=5000):
    chunks = []
    current_chunk = []
    current_token_count = 0

    for text in texts:
        token_count = len(text.split())  # Assuming each word is a token
        if current_token_count + token_count > max_chars:
            chunks.append(current_chunk)
            current_chunk = []
            current_token_count = 0
        current_chunk.append(text)
        current_token_count += token_count

    if current_chunk:
        chunks.append(current_chunk)

    return chunks


def prepare_section_for_embedding(section: ActSection) -> str:
    eli = section.act.ELI
    title = section.act.title.replace("w sprawie ogłoszenia jednolitego tekstu", "")
    chapter_title = section.chapters
    summary = section.summary
    # return f"Tytuł: {clean_title(title)}, {keywords}\n\nRozdział: {chapter_title}\n\nPodsumowanie: {summary}\n\n{eli}"
    return f"Tytuł: {clean_title(title)} \nFragment: {chapter_title}\nPodsumowanie: {summary}\n\n{eli}"


SYSTEM_MESSAGE = """
You are a legal expert specializing in creating concise summaries of legal documents for vector models. Your responses must always be in Polish language. Follow these rules:

1. IGNORE completely all information contained in the legal act's title and metadata
3. AVOID:
   - procedural and formal terminology
   - repeating information from metadata
   - references to document structure (chapters, articles)
   - information about authors and type of legal act
4. USE:
   - simple, understandable language
   - concrete examples of practical application of provisions
   - concise, factual phrasing

Response format:
- Maximum 5 sentences
- Continuous text without bullet points
- Exclusively in Polish language
"""


def create_prompt(chapter_content: str, metadata: dict) -> Prompt:
    prompt_template = """
    Utwórz zwięzłe streszczenie PRAKTYCZNYCH implikacji tego fragmentu. 
    Każde zdanie zacznij od konkretnej informacji (np. "Dzierżawca może...", "Właściciel ma prawo...").
    UNIKAJ fraz typu "Ten fragment reguluje...", "Przepisy określają...".
    
    metadane: {title} {sectionTitle} {keywords}
    
    {fragment_aktu}
    """

    return Prompt(
        system_instruction=SYSTEM_MESSAGE,
        prompt_data=[prompt_template],
        model_name="gemini-1.5-flash-002",
        variables=[
            {
                "fragment_aktu": [chapter_content],
                "title": [metadata["doc_title"]],
                "sectionTitle": [metadata["section_title"]],
                "keywords": [", ".join(metadata["keywords"])],
            }
        ],
        generation_config={
            "max_output_tokens": 250,
            "temperature": 1,
            "top_p": 0.95,
        },
    )
