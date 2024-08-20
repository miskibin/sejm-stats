from community_app.serializers import ArticleSerializer

from .acts import ActsMetaViewSet, ActViewSet
from .article import ArticleCreateView
from .clubs import ClubViewSet
from .committees import CommitteeViewSet
from .create_article import ArticleContextViewSet
from .envoys import EnvoyViewSet
from .faq import FAQViewSet
from .home import HomeViewSet
from .interpellations import InterpellationViewSet
from .processes import ProcessesMetaViewSet, ProcessViewSet
from .search import OptimizedSearchView
from .total_stats_view import TotalStatsView
from .votings import VotingsMetaViewSet, VotingViewSet
