from crispy_forms.helper import FormHelper
from crispy_forms.layout import Layout, Submit
from django import forms
from django.db.models import Count
from django_select2.forms import Select2MultipleWidget

from .models import ActStatus, Institution, Keyword, Publisher


class SearchForm(forms.Form):
    # keywords = forms.ModelMultipleChoiceField(
    #     queryset=Keyword.objects.annotate(num_acts=Count("act")).filter(
    #         num_acts__gte=35
    #     ),
    #     widget=Select2MultipleWidget(attrs={"class": "text-primary"}),
    #     required=False,
    #     label="Słowa kluczowe",
    # )
    keywords = forms.ModelChoiceField(
        queryset=Keyword.objects.annotate(num_acts=Count("act")).filter(
            num_acts__gte=30
        ),
        widget=forms.Select(attrs={"class": "form-select"}),
        required=False,
        label="Słowa kluczowe",
    )
    # ...
    publisher = forms.ModelChoiceField(
        queryset=Publisher.objects.all(),
        widget=forms.Select(),
        label="Wydawca",
        required=False,
    )
    institution = forms.ModelChoiceField(
        queryset=Institution.objects.annotate(num_acts=Count("act")).filter(
            num_acts__gte=1
        ),
        widget=forms.Select(),
        label="Instytucja",
        required=False,
    )

    status = forms.ModelChoiceField(
        queryset=ActStatus.objects.annotate(num_acts=Count("act")).filter(
            num_acts__gte=1
        ),
        label="Status",
        widget=forms.Select(),
        required=False,
    )
    minDate = forms.DateField(
        label="Data od", required=False, widget=forms.DateInput(attrs={"type": "date"})
    )
    maxDate = forms.DateField(
        label="Data do", required=False, widget=forms.DateInput(attrs={"type": "date"})
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.helper = FormHelper()
        self.helper.form_method = "get"
        self.helper.layout = Layout(
            "keywords",
            "publisher",
            "status",
            "minDate",
            "maxDate",
        )
