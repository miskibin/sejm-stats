from django.db import models

# cached property
from django.utils.functional import cached_property

from .club import Club


class Envoy(models.Model):
    id = models.AutoField(primary_key=True)
    photo = models.ImageField(upload_to="photos", null=True, blank=True)
    firstName = models.CharField(max_length=255)
    secondName = models.CharField(max_length=255, null=True, blank=True)
    lastName = models.CharField(max_length=255)
    email = models.EmailField(max_length=255)
    active = models.BooleanField(default=True)
    inactiveCause = models.CharField(max_length=255, null=True, blank=True)
    waiverDesc = models.TextField(null=True, blank=True)
    districtNum = models.IntegerField()
    districtName = models.CharField(max_length=255)
    voivodeship = models.CharField(max_length=255)
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name="envoys")
    birthDate = models.DateField()
    birthLocation = models.CharField(max_length=255)
    profession = models.CharField(max_length=255)
    educationLevel = models.CharField(max_length=255)
    numberOfVotes = models.IntegerField()
    biography = models.TextField(
        null=True, blank=True, help_text="Biography of the envoy pulled from wikipedia"
    )
    biography_source = models.URLField(
        null=True, blank=True, help_text="URL to the wikipedia page of the envoy"
    )
    isFemale = models.BooleanField(
        null=True, blank=True, help_text="Whether the envoy is female"
    )

    @cached_property
    def total_activity(self) -> int:
        return (
            self.votes.count() * 0.2
            + self.interpellations.count()
            + self.processes.count()
        )

    @cached_property
    def title(self) -> str:
        prefix = "Posłanka" if self.isFemale else "Poseł"
        return f"{prefix} {self.firstName} {self.lastName}"

    @cached_property
    def full_name(self) -> str:
        return f"{self.firstName} {self.secondName if self.secondName else ''} {self.lastName}"

    def __str__(self):
        return f"{self.firstName} {self.lastName} ({self.club.id})"

    class Meta:
        ordering = ["lastName"]
