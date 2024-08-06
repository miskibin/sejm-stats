#!/bin/sh
set -e

echo "Checking database readiness..."
until pg_isready -h "$DATABASE_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER"; do
    echo "Waiting for the database to be ready..."
    sleep 5
done

export PGPASSWORD="$POSTGRES_PASSWORD"

echo "Setting up PostgreSQL Text Search Configuration..."
psql -h "$DATABASE_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "
DO \$\$
BEGIN
    BEGIN
        CREATE TEXT SEARCH DICTIONARY pl_ispell (
            Template = ispell,
            DictFile = polish,
            AffFile = polish,
            StopWords = polish
        );
    EXCEPTION WHEN unique_violation THEN
        RAISE NOTICE 'Dictionary already exists, skipping creation.';
    END;
    BEGIN
        CREATE TEXT SEARCH CONFIGURATION pl_ispell (PARSER = default);
    EXCEPTION WHEN unique_violation THEN
        RAISE NOTICE 'Configuration already exists, skipping creation.';
    END;
    ALTER TEXT SEARCH CONFIGURATION pl_ispell
        ALTER MAPPING FOR asciiword, asciihword, hword_asciipart, word, hword, hword_part
        WITH pl_ispell;
END
\$\$;
"

echo "Applying Django migrations..."
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Loading initial data..."
python manage.py loaddata fixtures/faq.json

echo "Starting Gunicorn..."
exec gunicorn core.wsgi:application --bind 0.0.0.0:8000