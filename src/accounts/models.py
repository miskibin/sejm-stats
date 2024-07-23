from django.apps import apps
from django.conf import settings
from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
from django.templatetags.static import static
from django.urls import reverse
from django.utils.translation import gettext_lazy as _


class AccountsUserManager(UserManager):
    def _create_user(self, username, email, password, **extra_fields):
        if not email:
            raise ValueError("You have not provided e-mail")

        if not username:
            raise ValueError("You have not provided username")

        email = self.normalize_email(email)
        GlobalUserModel = apps.get_model(
            self.model._meta.app_label, self.model._meta.object_name
        )
        username = GlobalUserModel.normalize_username(username)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)  # make superuser active by default

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
        return self._create_user(username, email, password, **extra_fields)


class User(AbstractUser):
    first_name = models.CharField(_("first name"), max_length=32, blank=False)
    last_name = models.CharField(_("last name"), max_length=32, blank=False)
    email = models.EmailField(
        _("email address"),
        unique=True,
        error_messages={"unique": _("Użytkownik z takim adresem e-mail już istnieje.")},
    )
    username = models.CharField(
        _("username"),
        max_length=32,
        primary_key=True,
        unique=True,
        validators=[AbstractUser.username_validator],
        error_messages={"unique": _("Użytkownik z taką nazwą już istnieje.")},
    )

    is_active = models.BooleanField(_("active"), default=False)
    is_staff = models.BooleanField(_("staff status"), default=False)
    is_superuser = models.BooleanField(_("superuser"), default=False)

    objects = AccountsUserManager()

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email", "first_name", "last_name"]

    def get_profile(self):
        profile, _ = Profile.objects.get_or_create(user=self)
        return profile


def upload_avatar_to(instance, filename):
    return f"avatars/{instance.user.username}.png"


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.PROTECT)
    avatar = models.ImageField(upload_to=upload_avatar_to, blank=True, null=True)
    biography = models.TextField(blank=True)

    facebook_url = models.URLField(blank=True, null=True)
    x_twitter_url = models.URLField(blank=True, null=True)

    def get_avatar_url(self):
        if self.avatar:
            return self.avatar.url
        else:
            return static("img/avatar.png")

    def __str__(self):
        return f"{self.user.username}"

    def get_absolute_url(self):
        return reverse("profile")
