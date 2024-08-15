from community_app.db_update import tasks as community_tasks
from core.celery import app
from eli_app.db_update import tasks as eli_tasks
from sejm_app.db_updater import tasks as sejm_tasks

# for task in eli_tasks + sejm_tasks + community_tasks:
#     app.register_task(task)
from celery import chain
from celery import shared_task
from community_app.db_update import tasks as community_tasks
from eli_app.db_update import tasks as eli_tasks
from sejm_app.db_updater import tasks as sejm_tasks


@shared_task
def run_update_tasks():
    task_result = chain(t.s() for t in sejm_tasks + eli_tasks + community_tasks).delay()
    return task_result


for task in eli_tasks + sejm_tasks + community_tasks:
    app.register_task(task)
