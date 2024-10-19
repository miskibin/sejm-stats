import os
from sentence_transformers import SentenceTransformer
import numpy as np
from typing import Union, List
from pathlib import Path
from loguru import logger


class EmbeddingModel:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingModel, cls).__new__(cls)

            model_path = Path("/app/models/gte-Qwen2-1.5B-instruct")

            if not os.path.exists(model_path):
                logger.info(
                    "Model not found. Listing all files in the directory for debugging:"
                )
                for root, dirs, files in os.walk("/app/models"):
                    for name in dirs:
                        logger.info(f"Directory: {os.path.join(root, name)}")
                    for name in files:
                        logger.info(f"File: {os.path.join(root, name)}")
            if not os.path.exists(model_path):
                cls._instance.model = SentenceTransformer(
                    "Alibaba-NLP/gte-Qwen2-1.5B-instruct", trust_remote_code=True
                )
            else:
                cls._instance.model = SentenceTransformer(
                    model_path, trust_remote_code=True
                )
            cls._instance.model.max_seq_length = 4096
        return cls._instance

    def get_embeddings(self, texts: Union[str, List[str]]) -> np.ndarray:
        if isinstance(texts, str):
            texts = [texts]
        return self.model.encode(texts, show_progress_bar=True)

    def get_embedding_dimension(self) -> int:
        return self.model.get_sentence_embedding_dimension()


# Initialize the model when the module is imported
embedding_model = EmbeddingModel()


def get_embeddings(
    texts: Union[str, List[str]],
    max_seq_length: int = 8192,
) -> np.ndarray:
    return embedding_model.get_embeddings(texts)


def get_embedding_dimension() -> int:
    return embedding_model.get_embedding_dimension()
