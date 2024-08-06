FROM python:3.12

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /code
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev postgresql-client \
    # Cleaning up unused files
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /code/
RUN pip install --upgrade pip && pip install -r requirements.txt
# Now copy the rest of the code, this layer will be rebuilt when the rest of the code changes
COPY src/ /code/
COPY docker-entrypoint.sh /code/
RUN chmod +x /code/docker-entrypoint.sh
RUN pip install --upgrade pip && pip install -r requirements.txt
EXPOSE 8000
RUN ls -la /code/
ENTRYPOINT ["/code/docker-entrypoint.sh"]
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "core.wsgi:application"]
# docker build -t transparlament .
# docker run --env-file .env -p 8000:8000 transparlament