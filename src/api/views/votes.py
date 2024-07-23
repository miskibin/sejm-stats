from rest_framework.viewsets import ReadOnlyModelViewSet

from api.serializers import VoteSerializer
from sejm_app.models.vote import Vote


class VotesViewSet(ReadOnlyModelViewSet):
    serializer_class = VoteSerializer
    pagination_class = None

    def get_queryset(self):
        voting_id = self.kwargs.get("voting_id")
        votes = Vote.objects.filter(voting=voting_id).select_related("MP")
        return votes
