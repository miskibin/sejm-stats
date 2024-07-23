from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.translation import gettext_lazy as _
from rolepermissions.admin import RolePermissionsUserAdminMixin
from rolepermissions.roles import assign_role, remove_role

from accounts.forms import SignUpForm
from accounts.models import Profile, User


class AccountUserAdmin(UserAdmin, RolePermissionsUserAdminMixin):
    add_form = SignUpForm
    # form = UserChangeForm
    model = User
    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "is_active",
        "is_staff",
    )

    def assign_journalist_role(self, request, queryset):
        for user in queryset:
            assign_role(user, "journalist")

    assign_journalist_role.short_description = (
        "Assign journalist role to selected users"
    )

    def assign_journalist_role(self, request, queryset):
        for user in queryset:
            assign_role(user, "journalist")

    assign_journalist_role.short_description = (
        "Assign journalist role to selected users"
    )

    def unassign_journalist_role(self, request, queryset):
        for user in queryset:
            remove_role(user, "journalist")

    unassign_journalist_role.short_description = (
        "Unassign journalist role from selected users"
    )

    actions = [assign_journalist_role, unassign_journalist_role]
    list_filter = ("is_staff", "is_active", "is_superuser")
    fieldsets = (
        (None, {"fields": ("password",)}),
        (_("Personal info"), {"fields": ("first_name", "last_name", "email")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "username",
                    "email",
                    "first_name",
                    "last_name",
                    "password1",
                    "password2",
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
    )
    search_fields = ("username", "email", "first_name", "last_name")
    ordering = ("username",)


admin.site.register(User, AccountUserAdmin)
admin.site.register(Profile)
