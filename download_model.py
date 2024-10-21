from sentence_transformers import SentenceTransformer
from pathlib import Path


def download_model():
    model = SentenceTransformer("jinaai/jina-embeddings-v3", trust_remote_code=True)
    # create dir if not exists
    Path("/app/models").mkdir(parents=True, exist_ok=True)
    model.save("jinaai/jina-embeddings-v3")
    print("Model downloaded successfully")


if __name__ == "__main__":
    download_model()
