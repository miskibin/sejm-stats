from django import forms
from django.contrib.auth import forms as auth_forms
from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _

from accounts.models import Profile

UserModel = get_user_model()


class ProfileForm(forms.ModelForm):
    biography = forms.CharField(
        label=_("Biografia"),
        required=False,
        widget=forms.Textarea(
            attrs={
                "class": "form-control",
                "rows": 5,
                "aria-describedby": "errorsBiography",
            }
        ),
    )
    facebook_url = forms.URLField(
        label=_("Facebook URL"),
        required=False,
        widget=forms.URLInput(
            attrs={
                "class": "form-control form-control-lg",
                "aria-describedby": "errorsFacebookUrl",
            }
        ),
    )
    x_twitter_url = forms.URLField(
        label=_("X-Twitter URL"),
        required=False,
        widget=forms.URLInput(
            attrs={
                "class": "form-control form-control-lg",
                "aria-describedby": "errorsTwitterUrl",
            }
        ),
    )

    def __init__(self, *args, **kwargs):
        super(ProfileForm, self).__init__(*args, **kwargs)

        self.fields["avatar"] = forms.ImageField(
            label=_("Avatar"),
            required=False,
            widget=forms.FileInput(
                attrs={
                    "class": "file-upload-input",
                    "data-mdb-file-upload-init": True,
                    "data-mdb-default-file": (
                        self.instance.avatar.url if self.instance.avatar else None
                    ),
                    "aria-describedby": "errorsAvatar",
                    "style": "object-fit: cover;",
                    "accept": "image/*",
                }
            ),
        )
        self.fields["first_name"] = forms.CharField(
            label=_("Imię"),
            initial=self.instance.user.first_name,
            required=True,
            min_length=2,
            widget=forms.TextInput(
                attrs={
                    "class": "form-control form-control-lg",
                    "aria-describedby": "errorsFirstname",
                }
            ),
        )
        self.fields["last_name"] = forms.CharField(
            label=_("Nazwisko"),
            initial=self.instance.user.last_name,
            required=True,
            min_length=2,
            widget=forms.TextInput(
                attrs={
                    "class": "form-control form-control-lg",
                    "aria-describedby": "errorsLastname",
                }
            ),
        )

        self.fields["email"] = forms.EmailField(
            label=_("Adres e-mail"),
            initial=self.instance.user.email,
            required=True,
            disabled=True,
            widget=forms.EmailInput(
                attrs={
                    "class": "form-control form-control-lg",
                    "aria-describedby": "errorsEmail",
                }
            ),
        )

    def clean_facebook_url(self):
        facebook_url = self.cleaned_data["facebook_url"]
        if facebook_url and not facebook_url.startswith("https://www.facebook.com/"):
            self.add_error(
                "facebook_url",
                "Nieprawidłowy format URL. Upewnij się, że rozpoczyna się od 'https://www.facebook.com/'",
            )
        return facebook_url

    def clean_x_twitter_url(self):
        x_twitter_url = self.cleaned_data["x_twitter_url"]
        if x_twitter_url and not x_twitter_url.startswith("https://x.com/"):
            self.add_error(
                "x_twitter_url",
                "Nieprawidłowy format URL. Upewnij się, że rozpoczyna się od 'https://x.com/'",
            )
        return x_twitter_url

    def save(self, commit=True):
        if commit:
            user = self.instance.user
            user.first_name = self.cleaned_data["first_name"]
            user.last_name = self.cleaned_data["last_name"]
            user.email = self.cleaned_data["email"]
            user.save()
        return super(ProfileForm, self).save(commit=commit)

    class Meta:
        model = Profile
        fields = ("avatar", "biography", "facebook_url", "x_twitter_url")


class PasswordChangeForm(auth_forms.PasswordChangeForm):
    error_messages = {
        "password_mismatch": "Hasła w obu polach nie są zgodne",
        "password_incorrect": "Twoje stare hasło zostało wprowadzone niepoprawnie",
    }
    old_password = forms.CharField(
        label=_("Aktualne hasło"),
        required=True,
        strip=False,
        widget=forms.PasswordInput(
            attrs={
                "class": "form-control form-control-lg",
                "aria-describedby": "errorsOldPassword",
            }
        ),
    )
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
