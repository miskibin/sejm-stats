import os

from celery import Celery

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

app = Celery("core")
app.conf.broker_connection_retry_on_startup = True
# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object("django.conf:settings", namespace="CELERY")
app.conf.update(
    worker_concurrency=2,  # Reduce concurrency to 2
    worker_prefetch_multiplier=1,  # Reduce prefetch multiplier
)

# Load task modules from all registered Django apps.
app.autodiscover_tasks()
