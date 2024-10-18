from sentence_transformers import SentenceTransformer
from pathlib import Path


def download_model():
    model = SentenceTransformer(
        "Alibaba-NLP/gte-Qwen2-1.5B-instruct", trust_remote_code=True
    )
    # create dir if not exists
    Path("/app/models").mkdir(parents=True, exist_ok=True)
    model.save("/app/models/gte-Qwen2-1.5B-instruct")
    print("Model downloaded successfully")


if __name__ == "__main__":
    download_model()
