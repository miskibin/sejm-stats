from django.views.generic import TemplateView
from meta.views import MetadataMixin

from community_app.models import TeamMember
from sejm_app.models import FAQ


class AboutView(MetadataMixin, TemplateView):
    template_name = "about.html"
    title = "O nas - Sejm Stats"
    description = "Dowiedz się więcej o Sejm Stats, naszym zespole i naszej misji dostarczania przejrzystych i aktualnych danych z polskiego Sejmu."

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["faqs"] = FAQ.objects.all()  # Get all FAQ entries
        context["team_members"] = TeamMember.objects.filter(
            role__in=[TeamMember.Role.DEVELOPER, TeamMember.Role.CREATOR]
        )
        context["supporters"] = TeamMember.objects.filter(
            role__in=[TeamMember.Role.SUPPORTER, TeamMember.Role.SUPPORTER_SMALL]
        )
        return context
