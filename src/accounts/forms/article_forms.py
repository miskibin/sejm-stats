from django import forms

from community_app.models import Article
from sejm_app.models import Club, Envoy


class ArticleForm(forms.ModelForm):
    title = forms.CharField(
        label="Tytuł",
        required=True,
        min_length=5,
        max_length=255,
        widget=forms.TextInput(
            attrs={
                "class": "form-control form-control-lg",
                "aria-describedby": "errorsTitle",
            }
        ),
    )
    image = forms.ImageField(
        label="",
        max_length=255,
        required=True,
        widget=forms.FileInput(
            attrs={
                "class": "form-control form-control-lg",
                "aria-describedby": "errorsImage",
                "id": "image-input",
            }
        ),
    )
    content = forms.CharField(label="", required=False, initial="")
    clubs = forms.ModelMultipleChoiceField(
        queryset=Club.objects.all(),
        label="Kluby  (Opcjonalne)",
        required=False,
        widget=forms.SelectMultiple(
            attrs={
                "class": "form-select form-select-lg",
                "aria-describedby": "errorsClub",
                "data-mdb-select-init": True,
            }
        ),
    )
    envoys = forms.ModelMultipleChoiceField(
        queryset=Envoy.objects.all(),
        label="Posłowie (Opcjonalne)",
        required=False,
        widget=forms.SelectMultiple(
            attrs={
                "class": "form-select form-select-lg",
                "aria-describedby": "errorsEnvoy",
                "data-mdb-select-init": True,
            }
        ),
    )

    class Meta:
        model = Article
        fields = ["title", "image", "content", "clubs", "envoys"]
