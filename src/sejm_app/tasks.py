from community_app.db_update import tasks as community_tasks
from core.celery import app
from eli_app.db_update import tasks as eli_tasks
from sejm_app.db_updater import tasks as sejm_tasks

for task in eli_tasks + sejm_tasks + community_tasks:
    app.register_task(task)
