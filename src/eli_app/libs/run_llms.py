from asyncio import sleep
import os
from pathlib import Path
from typing import List
import numpy as np
import vertexai
from vertexai.language_models import TextEmbeddingInput, TextEmbeddingModel
from vertexai.preview.prompts import Prompt
from vertexai.generative_models import GenerativeModel, Part, SafetySetting
from loguru import logger

from eli_app.libs.llm_helpers import split_texts

credentials_path = Path(__file__).cwd() / "sejm-stats-439117-39efc9d2f8b8.json"
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(credentials_path)

vertexai.init(project="sejm-stats-439117")


def generate_summary(prompt: Prompt) -> str:
    responses = prompt.generate_content(
        contents=prompt.assemble_contents(**prompt.variables[0]),
        stream=True,
        safety_settings=[
            SafetySetting(category=cat, threshold=SafetySetting.HarmBlockThreshold.OFF)
            for cat in [
                SafetySetting.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                SafetySetting.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                SafetySetting.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                SafetySetting.HarmCategory.HARM_CATEGORY_HARASSMENT,
            ]
        ],
    )
    return " ".join("".join(response.text for response in responses).split())


def embed_text(texts: List[str]) -> list[np.ndarray]:
    try:
        model = TextEmbeddingModel.from_pretrained(
            "textembedding-gecko-multilingual@latest"
        )
        inputs = [TextEmbeddingInput(text, "RETRIEVAL_DOCUMENT") for text in texts]
        embeddings = model.get_embeddings(inputs)
        scaled_embeddings = [
            (np.array(embedding.values)).astype(np.float32) for embedding in embeddings
        ]

        logger.info(f"Successfully generated embeddings for {len(texts)} texts")
        return scaled_embeddings

    except Exception as e:
        logger.error(f"Failed to generate embeddings: {str(e)}")
        raise


def embed_texts_in_chunks(texts, max_tokens=5000):
    chunks = split_texts(texts, max_tokens)
    all_embeddings = []

    for chunk in chunks:
        logger.debug(f"Processing chunk with {len(chunk)} texts...")
        sleep(5)
        chunk_embeddings = embed_text(chunk)
        all_embeddings.extend(chunk_embeddings)

    return all_embeddings
