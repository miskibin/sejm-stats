from community_app.serializers import ArticleSerializer

from .search import SearchViewSet
from .home import HomeViewSet
from .envoys import EnvoyViewSet
from .clubs import ClubViewSet
from .interpellations import InterpellationViewSet
from .acts import ActViewSet, ActsMetaViewSet
from .votings import VotingViewSet, VotingsMetaViewSet
from .committees import (
    CommitteeViewSet,
)
from .processes import ProcessViewSet, ProcessesMetaViewSet
from .faq import FAQViewSet
from .create_article import ArticleContextViewSet