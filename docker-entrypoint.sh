#!/bin/sh

until pg_isready -h $DATABASE_HOST -p $POSTGRES_PORT -U $POSTGRES_USER; do
    echo "Waiting for the database to be ready..." 
    echo $DATABASE_HOST
    echo $POSTGRES_PORT
    echo $POSTGRES_USER
    sleep 5
done

export PGPASSWORD=$POSTGRES_PASSWORD

psql -h $DATABASE_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -c "
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
        -- do nothing, and continue execution
    END;
    BEGIN
        CREATE TEXT SEARCH CONFIGURATION pl_ispell (PARSER = default);
    EXCEPTION WHEN unique_violation THEN
        -- do nothing, and continue execution
    END;
    ALTER TEXT SEARCH CONFIGURATION pl_ispell
        ALTER MAPPING FOR asciiword, asciihword, hword_asciipart, word, hword, hword_part
        WITH pl_ispell;
END
\$\$;
"

# Add the pgvector extension
psql -h $DATABASE_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE EXTENSION IF NOT EXISTS VECTOR;"

python manage.py migrate

python manage.py collectstatic --noinput
python manage.py loaddata src/fixtures/faq.json

exec "$@"