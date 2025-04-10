# Generated by Django 5.0 on 2024-04-21 21:14

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("sejm_app", "0020_alter_voting_category"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="printmodel",
            options={"ordering": ["documentDate"]},
        ),
        migrations.AlterField(
            model_name="club",
            name="email",
            field=models.EmailField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name="club",
            name="phone",
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name="voting",
            name="category",
            field=models.CharField(
                blank=True,
                choices=[
                    ("APPLICATION", "Wniosek formalny"),
                    ("PRINTS", "Głosowanie druków"),
                    ("WHOLE_PROJECT", "Głosowanie nad całością projektu"),
                    ("AMENDMENT", "Głosowanie nad poprawką"),
                    ("CANDIDATES", "Głosowanie na kandydatów"),
                    ("OTHER", "Inne"),
                ],
                help_text="Voting category",
                max_length=32,
                null=True,
            ),
        ),
    ]
