from django.conf import settings
from django.db import models


class Club(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=255, null=True, blank=True)
    fax = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, null=True, blank=True)
    membersCount = models.IntegerField()
    photo = models.ImageField(upload_to="club_logos", null=True, blank=True)

    def __str__(self):
        return f"{self.id}"

    @property
    def api_url(self):
        return settings.CLUBS_URL
