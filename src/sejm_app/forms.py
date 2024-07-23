from django import forms
from django_select2.forms import Select2MultipleWidget, Select2Widget

from sejm_app.models.voting import Voting

from .models import Club, CommitteeType, Envoy, Process


class EnvoyChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        return f"{obj.firstName} {obj.lastName}"


from django import forms

from .models import Voting


class VotingSearchForm(forms.Form):
    kind = forms.ChoiceField(
        required=False,
        widget=forms.Select(attrs={"class": "form-select"}),
        label="Typ głosowania",
        choices=[("", "---------")] + list(Voting.Kind.choices),
    )
    category = forms.ChoiceField(
        required=False,
        widget=forms.Select(attrs={"class": "form-select"}),
        label="Kategoria",
        choices=[("", "---------")] + list(Voting.Category.choices),
    )
    envoy = EnvoyChoiceField(
        queryset=Envoy.objects.none(),  # Empty initial queryset
        widget=forms.Select(attrs={"class": "form-select my-3"}),
        required=False,
        label="Poseł",
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["envoy"].queryset = Envoy.objects.all()


class EnvoySearchForm(forms.Form):
    searchEnvoys = forms.CharField(
        required=False,
        widget=forms.TextInput(
            attrs={"class": "form-control mb-3", "placeholder": "wyszukaj posła..."}
        ),
    )
    club = forms.ModelMultipleChoiceField(
        queryset=Club.objects.all(),
        widget=Select2MultipleWidget(attrs={"class": "form-check-input"}),
        required=False,
    )
    district = forms.ModelChoiceField(
        queryset=Envoy.objects.all().values_list("districtName", flat=True).distinct(),
        empty_label="Wszystkie",
        widget=Select2Widget(attrs={"class": "form-select my-3"}),
        required=False,
    )


class InterpellationSearchForm(forms.Form):
    fromMember_id = EnvoyChoiceField(
        queryset=Envoy.objects.none(),  # Empty initial queryset
        widget=forms.Select(attrs={"class": "form-select my-3"}),
        required=False,
        label="Autor",
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["fromMember_id"].queryset = Envoy.objects.all()


class CommitteeSearchForm(forms.Form):
    type = forms.ChoiceField(
        required=False,
        widget=forms.Select(attrs={"class": "form-select"}),
        label="Typ",
    )
    appointmentDate_from = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={"class": "form-control", "type": "date"}),
        label="Data mianowania (od)",
    )
    appointmentDate_to = forms.DateField(
        required=False,
        widget=forms.DateInput(attrs={"class": "form-control", "type": "date"}),
        label="Data mianowania (do)",
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["type"].choices = CommitteeType.choices + [("all", "Wszystkie")]


class ProcessSearchForm(forms.Form):
    state = forms.BooleanField(
        required=False,
        widget=forms.CheckboxInput(attrs={"class": "form-check-input"}),
        label="Tylko niezakończone",
    )
    documentType = forms.MultipleChoiceField(
        widget=forms.CheckboxSelectMultiple(attrs={"class": "form-check-input"}),
        required=False,
        label="Typ dokumentu",
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["documentType"].choices = (
            Process.objects.all().values_list("documentType", "documentType").distinct()
        )
