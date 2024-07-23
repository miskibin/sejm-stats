from celery import Task
from django.db import OperationalError, ProgrammingError
from django.db.models import Model
from django.utils import timezone
from loguru import logger

from sejm_app import models


class DbUpdaterTask(Task):
    MODEL: Model = None
    DATE_FIELD_NAME = None
    time_limit = 6 * 60 * 60
    SKIP_BY_DEFAULT = False

    def __init__(self) -> None:
        self.name = self.MODEL.__name__
        super().__init__()

    def check_if_should_update(self):
        try:
            self.MODEL.objects.first()
        except (OperationalError, ProgrammingError) as e:
            logger.warning(f"Database not initialized yet {e}")
            return False
        return self._should_be_updated()

    def _should_be_updated(self) -> bool:
        if not self.DATE_FIELD_NAME:
            logger.warning(f"DATE_FIELD_NAME not set for {self.name}")
            if self.MODEL.objects.count() == 0:
                return True
            return not self.SKIP_BY_DEFAULT
        return (
            not self.MODEL.objects.order_by("-" + self.DATE_FIELD_NAME).first()
            == timezone.now().date()
        )

    def on_success(self, retval, task_id, args, kwargs):
        logger.info(f"Finished {self.name} update")
        return super().on_success(retval, task_id, args, kwargs)

    def __call__(self, *args, **kwargs):
        if not self.check_if_should_update():
            logger.info(f"Skipping {self.name} update")
            return
        res = super().__call__(*args, **kwargs)
        return res
