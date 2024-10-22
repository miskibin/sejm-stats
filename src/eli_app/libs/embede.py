import os
from pathlib import Path
from typing import List
import numpy as np
import vertexai
from vertexai.language_models import TextEmbeddingInput, TextEmbeddingModel

# Set the environment variable for Google Application Credentials
# Root directory.
credentials_path = Path(__file__).cwd() / "sejm-stats-439117-39efc9d2f8b8.json"
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(credentials_path)

# Initialize Vertex AI
vertexai.init(project="sejm-stats-439117")


def embed_text(texts: List[str]) -> List[np.ndarray]:
    """
    Generate embeddings for given texts and scale them to better utilize float32 precision.
    Original values are in range [-1, 1], scaling by 1e10 gives range [-10B, 10B]
    which is well within float32 range of ±3.4e38.

    Args:
        texts: List of strings to embed

    Returns:
        List of scaled embeddings as float32 values
    """
    dimensionality = 512
    task = "RETRIEVAL_DOCUMENT"
    model = TextEmbeddingModel.from_pretrained("text-multilingual-embedding-002")
    inputs = [TextEmbeddingInput(text, task) for text in texts]
    kwargs = dict(output_dimensionality=dimensionality) if dimensionality else {}
    embeddings = model.get_embeddings(inputs, **kwargs)
    scaled_embeddings = [
        (np.array(embedding.values)).astype(np.float32) for embedding in embeddings
    ]
    return scaled_embeddings
    # return embeddings
