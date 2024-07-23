from django.db import models

from .voting import Voting


class Resolution(models.Model):
    voting = models.ForeignKey(Voting, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(max_length=255)
    body = models.TextField(null=True, blank=True)
    summary = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.id}"
