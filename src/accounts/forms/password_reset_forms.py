from django import forms
from django.contrib.auth import forms as auth_forms
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

UserModel = get_user_model()


class PasswordResetForm(auth_forms.PasswordResetForm):
    email = forms.EmailField(
        label=_("Adres e-mail"),
        required=True,
        widget=forms.EmailInput(
            attrs={
                "class": "form-control form-control-lg",
                "aria-describedby": "errorsEmail",
                "autocomplete": "email",
            }
        ),
    )

    def clean_email(self):
        email = self.cleaned_data.get("email")
        if email and not UserModel.objects.filter(email__iexact=email).exists():
            self.add_error("email", "Nie znaleziono użytkownika z takim adresem e-mail")
        elif email and not UserModel.objects.get(email__iexact=email).is_active:
            self.add_error("email", "Konto jest nieaktywne")
        else:
            return email.lower()


class PasswordResetConfirmForm(auth_forms.SetPasswordForm):
    error_messages = {"password_mismatch": _("Hasła w obu polach nie są zgodne.")}
    new_password1 = forms.CharField(
        label=_("Nowe hasło"),
        required=True,
        strip=False,
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control form-control-lg",
                "aria-describedby": "errorsNewPassword1",
            }
        ),
    )
    new_password2 = forms.CharField(
        label=_("Powtórz nowe hasło"),
        required=True,
        strip=False,
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control form-control-lg",
                "aria-describedby": "errorsNewPassword2",
            }
        ),
    )
