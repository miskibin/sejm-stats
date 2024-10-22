# Build stage
FROM python:3.12 AS builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code

# Copy requirements file
COPY requirements.txt .

# Install build dependencies and Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && pip install --upgrade pip \
    && pip install --user -r requirements.txt \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Final stage
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV TESSDATA_PREFIX /usr/share/tesseract-ocr/5/tessdata
ENV PATH=/root/.local/bin:$PATH

WORKDIR /code

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    postgresql-client \
    poppler-utils \
    tesseract-ocr \
    wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && wget -O /tmp/pol.traineddata https://github.com/tesseract-ocr/tessdata/raw/main/pol.traineddata \
    && mkdir -p /usr/share/tesseract-ocr/5/tessdata \
    && mv /tmp/pol.traineddata /usr/share/tesseract-ocr/5/tessdata/

# Copy installed packages from builder stage
COPY --from=builder /root/.local /root/.local

# Copy application code
COPY src/ /code/
COPY /sejm-stats-439117-39efc9d2f8b8.json /code/
COPY docker-entrypoint.sh /code/
RUN chmod +x /code/docker-entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/code/docker-entrypoint.sh"]

# Use build argument to determine which service to run
ARG SERVICE=web
ENV SERVICE=${SERVICE}

CMD if [ "$SERVICE" = "celery" ]; then \
    celery -A core worker --beat --scheduler django -l INFO; \
    else \
    gunicorn --bind 0.0.0.0:8000 core.wsgi:application; \
    fi

# Build commands:
# For web: docker build --build-arg SERVICE=web -t transparlament:web .
# For celery: docker build --build-arg SERVICE=celery -t transparlament:celery .