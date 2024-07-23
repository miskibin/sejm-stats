from rolepermissions.roles import AbstractUserRole


class Journalist(AbstractUserRole):
    available_permissions = {
        "create_article": True,
        "edit_article": True,
        "delete_article": True,
        "view_article": True,
    }
