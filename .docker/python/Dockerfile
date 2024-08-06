FROM python:3.12 AS base
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
WORKDIR /code

RUN useradd nginx && usermod -u 1001 www-data && groupmod -g 1001 www-data

RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev postgresql-client nginx supervisor \
    && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /var/log/supervisor

FROM base AS dev

COPY ./.docker/python/docker-entrypoint.sh /code/
RUN chmod +x /code/docker-entrypoint.sh

FROM base AS prod
COPY requirements.txt /code/
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY src /code/
COPY ./.docker/python/docker-entrypoint.sh /etc/entrypoint.sh
COPY ./.docker/python/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY ./.docker/nginx/default.conf /etc/nginx/nginx.conf
RUN chmod +x /etc/entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/etc/entrypoint.sh"]