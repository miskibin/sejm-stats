# Generated by Django 5.0 on 2024-10-21 15:29

import pgvector.django.vector
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('eli_app', '0002_act_embedding'),
    ]

    operations = [
        migrations.AlterField(
            model_name='act',
            name='embedding',
            field=pgvector.django.vector.VectorField(blank=True, dimensions=512, null=True),
        ),
    ]