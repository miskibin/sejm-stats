from multiprocessing import Process

from rest_framework import serializers

from .articleSerializer import ArticleSerializer
from .detail_serializers import *
from .EnvoyDetailSerializer import EnvoyDetailSerializer
from .list_serializers import *
from .Total_stats_serializer import TotalStatsSerializer
from .VotingDetailSerializer import VotingDetailSerializer
