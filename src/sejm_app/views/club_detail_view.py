from django.views.generic import DetailView

from sejm_app.models import Club, ClubVote, Envoy


class ClubDetailView(DetailView):
    model = Club
    template_name = "club_detail.html"  # replace with your template
    context_object_name = "club"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["envoys"] = Envoy.objects.filter(club=context["club"])
        club_votes = ClubVote.objects.filter(club=context["club"])
        context["club_votes"] = club_votes
        return context
