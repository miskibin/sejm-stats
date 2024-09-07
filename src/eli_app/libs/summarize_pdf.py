import PyPDF2
import requests
from loguru import logger
from transformers import (AutoModelForSeq2SeqLM, AutoTokenizer,
                          SummarizationPipeline, pipeline)

model_name = "allenai/led-large-16384-arxiv"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

pipe = pipeline("text2text-generation", model=model, tokenizer=tokenizer)


def extract_text_from_pdf(pdf_path):
    pdf_file_obj = open(pdf_path, "rb")
    # ...
    logger.info(f"Extracting text from pdf")
    pdf_reader = PyPDF2.PdfReader(pdf_file_obj)
    # remove headers and footers
    for page in pdf_reader.pages:
        page.mediabox.lower_left = (
            page.mediabox.left,
            page.mediabox.bottom + 50,
        )
    text = ""
    for page in pdf_reader.pages:
        text += page.extract_text()
    pdf_file_obj.close()
    logger.debug(f"Pdf text: {text}")
    return text


# ...


def summarize_text(text):
    text = text.replace("\xa0", " ")
    model = "sshleifer/distilbart-cnn-12-6"
    summarizer: SummarizationPipeline = pipeline("summarization", model=model)

    summary = summarizer(text, max_length=100, min_length=30, do_sample=False)
    return summary[0]["summary_text"]


def summarize_pdf(pdf_path):
    text = extract_text_from_pdf(pdf_path)
    summary = summarize_text(text)
    return summary


# resp = requests.get("https://api.sejm.gov.pl/eli/acts/DU/2023/3/text.pdf", stream=True)
# with open("myfile.pdf", "wb") as f:
#     f.write(resp.content)
# pdf = resp.content
# logger.info("Downloaded pdf")


# # Write the bytes to a file
# with open("temp.pdf", "wb") as f:
#     f.write(pdf)
# print(summarize_pdf("temp.pdf"))
text = """
zmieniające rozporządzenie w sprawie wymagań, jakim powinna odpowiadać osoba zajmująca stanowisko dyrektora
oraz inne stanowisko kierownicze w publicznym przedszkolu, publicznej szkole podstawowej,
publicznej szkole ponadpodstawowej oraz publicznej placówce"""
print(summarize_text(text))
