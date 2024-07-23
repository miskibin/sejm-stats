from django.db.models import Case, CharField, OuterRef, Subquery, Value, When
from django.http import JsonResponse
from django.urls import reverse
from django.views.generic import ListView
from loguru import logger
from meta.views import MetadataMixin

from core.generic.mixins import JsonResponseMixin, SearchFormMixin
from sejm_app.forms import VotingSearchForm
from sejm_app.models import Voting
from sejm_app.models.vote import Vote, VoteOption

ICON_STR = '<i class="fa fa-lg text-{color} fa-{icon}"></i>'


class BaseVotingListView(ListView):
    model = Voting
    form_class = VotingSearchForm
    template_name = "voting_list.html"
    context_object_name = "votings"


class VotingHTMLListView(MetadataMixin, BaseVotingListView):
    title = "Lista Głosowań - Sejm Stats"
    description = "Przeglądaj listę głosowań w Sejm Stats. Odkryj szczegółowe informacje o różnych głosowaniach w polskim Sejmie."

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        form = VotingSearchForm(self.request.GET)
        context["form"] = form

        if form.is_valid():
            context["envoy"] = form.cleaned_data.get("envoy")
        return context

    def render_to_response(self, context, **response_kwargs):
        return super().render_to_response(context, **response_kwargs)


class VotingJSONListView(BaseVotingListView):
    def process_envoy_context(self, queryset, envoy):
        ICON_MAPPING = {
            VoteOption.NO: {"color": "danger", "icon": "thumbs-down"},
            VoteOption.YES: {"color": "success", "icon": "thumbs-up"},
            VoteOption.ABSTAIN: {"color": "primary", "icon": "child-reaching"},
            VoteOption.ABSENT: {"color": "warning", "icon": "arrow-right-from-bracket"},
            VoteOption.VOTE_VALID: {"color": "info", "icon": "check-circle"},
        }

        icons = {
            vote_option: ICON_STR.format(**icon_info)
            for vote_option, icon_info in ICON_MAPPING.items()
        }
        envoy_votes = (
            Vote.objects.filter(MP=envoy, voting=OuterRef("pk"))
            .annotate(
                vote_verbose=Case(
                    *[When(vote=k, then=Value(v)) for k, v in icons.items()],
                    default=Value(""),
                    output_field=CharField(),
                )
            )
            .values("vote_verbose")[:1]
        )

        return queryset.filter(votes__MP=envoy).annotate(
            envoy_vote=Subquery(envoy_votes[:1])
        )

    def get_item_url(self, item: Voting):
        return reverse("voting_detail", kwargs={"pk": item.pk})

    def get_json_fields(self):
        return ["date", "title", "success"]

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        form = VotingSearchForm(self.request.GET)
        context["form"] = form
        if form.is_valid():
            queryset = self.get_queryset()
            context["vote_counts"] = {
                "succeed": queryset.filter(success=True).count(),
                "failed": queryset.filter(success=False).count(),
            }

            envoy = form.cleaned_data.get("envoy")
            if envoy:
                context["envoy"] = envoy
                votes = Vote.objects.filter(MP=envoy, voting__in=queryset)
                context["vote_counts"].update(
                    {
                        "no": votes.filter(vote=VoteOption.NO).count(),
                        "yes": votes.filter(vote=VoteOption.YES).count(),
                        "abstain": votes.filter(vote=VoteOption.ABSTAIN).count(),
                        "absent": votes.filter(vote=VoteOption.ABSENT).count(),
                        "vote_valid": votes.filter(vote=VoteOption.VOTE_VALID).count(),
                    }
                )
                logger.info(context["vote_counts"])
        return context

    def render_to_response(self, context, **response_kwargs):
        envoy = context.get("envoy")
        cols = ["Data", "Temat", "wynik"]
        if envoy:
            cols = ["Data", "Temat", "Wynik", "Głos posła"]
        rows = [
            [
                voting.date.strftime("%d %m %Y"),
                f'{voting.title}: {"<span class='fw-bold'>" + str(voting.prints.first()) + "</span>" if voting.category == "WHOLE_PROJECT" else voting.topic or voting.description}',
                (
                    ICON_STR.format(color="success", icon="check")
                    if voting.success
                    else ICON_STR.format(color="danger", icon="x")
                ),
                voting.envoy_vote if "envoy" in context else None,
            ]
            for voting in self.get_queryset()
        ]
        urls = [
            reverse("voting_detail", kwargs={"pk": voting.pk})
            for voting in self.get_queryset()
        ]
        return JsonResponse(
            {
                "data": rows,
                "columns": cols,
                "urls": urls,
                "stats": context.get("vote_counts", {}),
            }
        )

    def get_queryset(self):
        queryset = super().get_queryset()
        form = VotingSearchForm(self.request.GET)
        if form.is_valid():
            if form.cleaned_data["kind"]:
                queryset = queryset.filter(kind=form.cleaned_data["kind"])
            if form.cleaned_data["category"]:
                queryset = queryset.filter(category=form.cleaned_data["category"])
            if form.cleaned_data["envoy"]:
                queryset = self.process_envoy_context(
                    queryset, form.cleaned_data["envoy"]
                )

        return queryset
