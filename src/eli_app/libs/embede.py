from sentence_transformers import SentenceTransformer
import numpy as np
from typing import Union, List


class EmbeddingModel:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingModel, cls).__new__(cls)
            cls._instance.model = SentenceTransformer(
                "Alibaba-NLP/gte-Qwen2-1.5B-instruct", trust_remote_code=True
            )
            cls._instance.model.max_seq_length = 8192
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
