import os
from pathlib import Path
from typing import List
import numpy as np
import vertexai
from vertexai.language_models import TextEmbeddingInput, TextEmbeddingModel
from vertexai.preview.prompts import Prompt
from vertexai.generative_models import GenerativeModel, Part, SafetySetting
from loguru import logger

credentials_path = Path(__file__).cwd() / "sejm-stats-439117-39efc9d2f8b8.json"
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = str(credentials_path)

vertexai.init(project="sejm-stats-439117")

class LegalSummarizer:
    """Class for generating legal document summaries using Vertex AI."""

    def __init__(self) -> None:
        self._prompt_template = """Jesteś asystentem prawnym tworzącym semantyczne streszczenia aktów prawnych na potrzeby modeli wektorowych. Stwórz zwięzłe streszczenie skupiające się wyłącznie na głównych przepisach i ich znaczeniu. Unikaj słów proceduralnych/formalnych. Streszczenie musi byc tresciwe. Postaraj się zawrzeć maksymalną ilość istotnych informacji prawnych w 2-3 krótkich zdaniach. 
        NIE POWTARZAJ INFORMACJI DOSTEPNYCH W TYTULE:
        {tytul}

        Akt prawny do streszczenia:
        {akt_prawny}"""

    def create_prompt(self, title: str, act_content: str) -> Prompt:
        try:
            variables = [
                {
                    "akt_prawny": [act_content],
                    "tytul": [title],
                }
            ]

            return Prompt(
                prompt_data=[self._prompt_template],
                model_name=self.config.model_name,
                variables=variables,
                generation_config={
                    "max_output_tokens": 1024,
                    "temperature": 1,
                    "top_p": 0.95,
                },
                safety_settings=[
                    SafetySetting(
                        category=cat, threshold=SafetySetting.HarmBlockThreshold.OFF
                    )
                    for cat in [
                        SafetySetting.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                        SafetySetting.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                        SafetySetting.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                        SafetySetting.HarmCategory.HARM_CATEGORY_HARASSMENT,
                    ]
                ],
            )
        except Exception as e:
            logger.error(f"Failed to create prompt: {str(e)}")
            raise

    def generate_summary(self, prompt: Prompt) -> str:
        try:
            responses = prompt.generate_content(
                contents=prompt.assemble_contents(**prompt.variables[0]),
                stream=True,
            )

            summary = "".join(response.text for response in responses)
            logger.info("Successfully generated summary")
            if len(summary) > 1024:
                logger.warning(
                    f"Generated summary exceeds recommended length. "
                    f"Current length: {len(summary)} characters, "
                    f"recommended maximum: 1024 characters"
                )
            return summary
                
        except Exception as e:
            logger.error(f"Failed to generate summary: {str(e)}")
            raise



def embed_text(texts: List[str]) -> List[np.ndarray]:
    try:
        model = TextEmbeddingModel.from_pretrained("text-multilingual-embedding-002")
        inputs = [TextEmbeddingInput(text, "RETRIEVAL_DOCUMENT") for text in texts]
        kwargs = (
            dict(output_dimensionality=512)
        )

        embeddings = model.get_embeddings(inputs, **kwargs)
        scaled_embeddings = [
            (np.array(embedding.values)).astype(np.float32)
            for embedding in embeddings
        ]

        logger.info(f"Successfully generated embeddings for {len(texts)} texts")
        return scaled_embeddings

    except Exception as e:
        logger.error(f"Failed to generate embeddings: {str(e)}")
        raise
