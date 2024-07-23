from django.db import models
from django.utils.functional import cached_property


# Create your models here.
class Publisher(models.Model):
    actsCount = models.IntegerField(null=True, blank=True)
    code = models.CharField(max_length=255, primary_key=True, unique=True)
    name = models.CharField(max_length=255)
    shortName = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class ActStatus(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Keyword(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Institution(models.Model):  # TODO remove institution with 0 acts
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return f'{self.name[:50]}{"... " if len(self.name) > 50 else ""}'

    @classmethod
    def get_by_name(cls, name: str):
        name = name.strip()
        name = name.upper()
        return cls.objects.get(name=name)


class DocumentType(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Reference(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Act(models.Model):
    ELI = models.CharField(max_length=255, primary_key=True)
    address = models.CharField(max_length=255)
    announcementDate = models.DateField(blank=True, null=True)
    changeDate = models.DateTimeField()
    displayAddress = models.CharField(max_length=255)
    pos = models.IntegerField()
    publisher = models.ForeignKey(Publisher, on_delete=models.CASCADE)
    status = models.ForeignKey(ActStatus, on_delete=models.CASCADE)
    textHTML = models.BooleanField()
    textPDF = models.BooleanField()
    title = models.CharField(max_length=1024)
    type = models.ForeignKey(DocumentType, on_delete=models.CASCADE, null=True)
    volume = models.IntegerField()
    year = models.IntegerField()
    directives = models.JSONField()
    entryIntoForce = models.DateField(blank=True, null=True)
    inForce = models.CharField(max_length=255)
    keywords = models.ManyToManyField(Keyword)
    releasedBy = models.ForeignKey(Institution, on_delete=models.CASCADE, null=True)

    # keywordsNames = JSONField()
    # obligated = JSONField()
    # organUprawniony = JSONField()
    # previousTitle = JSONField()
    # prints = JSONField()
    # references = JSONField()
    # texts = JSONField()
    @cached_property
    def url(self) -> str:
        return f"https://api.sejm.gov.pl/eli/acts/{self.ELI}/text.pdf"

    def __str__(self):
        return f"{self.ELI} - {self.title}"
