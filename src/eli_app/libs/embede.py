import os
from pathlib import Path
from typing import List
import vertexai
from vertexai.language_models import TextEmbeddingInput, TextEmbeddingModel
from loguru import logger

# Set the environment variable for Google Application Credentials
# Root directory.
credentials_path = Path(__file__).cwd() / "sejm-stats-439117-39efc9d2f8b8.json"
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(credentials_path)
logger.info(
    f"GOOGLE_APPLICATION_CREDENTIALS: {os.environ['GOOGLE_APPLICATION_CREDENTIALS']}"
)
# Initialize Vertex AI
vertexai.init(project="sejm-stats-439117")


def embed_text(texts: List[str]) -> List[List[float]]:
    dimensionality = 512
    task = "RETRIEVAL_DOCUMENT"

    model = TextEmbeddingModel.from_pretrained("text-multilingual-embedding-002")
    inputs = [TextEmbeddingInput(text, task) for text in texts]
    kwargs = dict(output_dimensionality=dimensionality) if dimensionality else {}

    embeddings = model.get_embeddings(inputs, **kwargs)
    return [embedding.values for embedding in embeddings]
