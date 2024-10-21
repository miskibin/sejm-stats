from django.db import models
from pgvector.django import VectorField


class VectorizedModel(models.Model):
    embedding = VectorField(
        dimensions=512, null=True, blank=True
    )  # 1536-dimensional vector field

    class Meta:
        abstract = True  # This makes it a base class that won't create a database table

    def __str__(self):
        return f"{self.__class__.__name__} (ID: {self.id})"

    # You can add common methods here that all vectorized models might use
    def similarity(self, other):
        """
        Calculate cosine similarity with another instance
        """
        return 1 - (self.embedding @ other.embedding)

    # Add other common methods as needed
