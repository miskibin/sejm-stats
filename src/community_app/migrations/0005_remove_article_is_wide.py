# Generated by Django 5.0 on 2024-10-07 12:06

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("community_app", "0004_alter_article_options_article_is_wide_article_tags"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="article",
            name="is_wide",
        ),
    ]