# Generated by Django 5.0 on 2024-03-28 10:02

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("sejm_app", "0012_remove_committeesitting_video_id_and_more"),
    ]

    operations = [
        migrations.RenameField(
            model_name="reply",
            old_name="interpolation",
            new_name="interpellation",
        ),
    ]
