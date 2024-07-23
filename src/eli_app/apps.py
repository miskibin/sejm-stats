from django.apps import AppConfig


class EliAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "eli_app"

    def ready(self) -> None:
        # from eli_app.libs.populate_db import init_db

        # init_db()
        return super().ready()
