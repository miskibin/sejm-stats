from django import forms
from django.contrib.auth import forms as auth_forms
from django.contrib.auth import get_user_model, password_validation
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

UserModel = get_user_model()


class SignInForm(auth_forms.AuthenticationForm):
    error_messages = {
        "invalid_login": "Proszę wprowadzić prawidłową nazwę użytkownika i hasło.",
        "inactive": "To konto jest nieaktywne.",
    }
    username = forms.CharField(
        label="Nazwa użytkownika",
        required=True,
        widget=forms.TextInput(
            attrs={
                "class": "form-control form-control-lg",
                "aria-describedby": "errorsUsername",
            }
        ),
    )
    password = forms.CharField(
        label="Hasło",
        required=True,
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control form-control-lg",
                "aria-describedby": "errorsPassword",
            }
        ),
    )
    remember_me = forms.BooleanField(
        label="Zapamiętaj mnie",
        required=False,
        initial=True,
        widget=forms.CheckboxInput(attrs={"class": "form-check-input"}),
    )

    def clean_username(self):
        username = self.cleaned_data.get("username")
        if username:
            return username.lower()
        return username

    class Meta:
        model = UserModel
        fields = ("username", "remember_me")


class SignUpForm(auth_forms.UserCreationForm):
    error_messages = {
        "password_mismatch": "Hasła w obu polach nie są zgodne.",
        "unique_email": "Użytkownik z takim adresem e-mail już istnieje.",
        "unique_username": "Użytkownik z taką nazwą już istnieje.",
    }

    first_name = forms.CharField(
        label=_("Imię"),
        required=True,
        min_length=2,
        widget=forms.TextInput(
            attrs={
                "class": "form-control form-control-lg",
                "aria-describedby": "errorsFirstname",
            }
        ),
    )
    last_name = forms.CharField(
        label=_("Nazwisko"),
        required=True,
        min_length=2,
        widget=forms.TextInput(
            attrs={
                "class": "form-control form-control-lg",
                "aria-describedby": "errorsLastname",
            }
        ),
    )

    email = forms.EmailField(
        label=_("Adres e-mail"),
        required=True,
        widget=forms.EmailInput(
            attrs={
                "class": "form-control form-control-lg",
                "aria-describedby": "errorsEmail",
            }
        ),
    )
    username = forms.CharField(
        label=_("Nazwa użytkownika"),
        required=True,
        widget=forms.TextInput(
            attrs={
                "class": "form-control form-control-lg",
                "aria-describedby": "errorsUsername",
            }
        ),
    )
    password1 = forms.CharField(
        label=_("Hasło"),
        required=True,
        strip=False,
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control form-control-lg",
                "aria-describedby": "errorsPassword1",
            }
        ),
    )
    password2 = forms.CharField(
        label=_("Powtórz hasło"),
        required=True,
        strip=False,
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control form-control-lg",
                "aria-describedby": "errorsPassword2",
            }
        ),
    )
    agree_terms = forms.BooleanField(
        label="Zapoznałem się i akceptuję regulamin serwisu. ",
        required=True,
        initial=False,
        widget=forms.CheckboxInput(attrs={"class": "form-check-input"}),
    )

    def clean_username(self):
        username = self.cleaned_data.get("username")
        if (
            username
            and self._meta.model.objects.filter(username__iexact=username).exists()
        ):
            self.add_error("username", self.error_messages["unique_username"])
        else:
            return username.lower()

    def clean_email(self):
        email = self.cleaned_data.get("email")
        if email and self._meta.model.objects.filter(email__iexact=email).exists():
            self.add_error("email", self.error_messages["unique_email"])
        else:
            return email.lower()

    def clean_password2(self):
        password1 = self.cleaned_data.get("password1")
        password2 = self.cleaned_data.get("password2")
        if password1 and password2 and password1 != password2:
            self.add_error("password2", self.error_messages["password_mismatch"])
        return password2

    def _post_clean(self):
        super()._post_clean()
        password = self.cleaned_data.get("password1")
        if password:
            try:
                password_validation.validate_password(password, self.instance)
            except ValidationError as error:
                self.add_error("password1", error)

    def save(self, commit=True):
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
            if hasattr(self, "save_m2m"):
                self.save_m2m()
        return user

    class Meta:
        model = UserModel
        fields = (
            "first_name",
            "last_name",
            "email",
            "username",
            "password1",
            "password2",
        )
