from django.db import models


class AggregatedModel(models.Model):
    max_total_activity = models.IntegerField(default=0)

    def save(self, *args, **kwargs):
        self.pk = 1
        super(AggregatedModel, self).save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj
