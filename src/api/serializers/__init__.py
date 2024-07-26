from multiprocessing import Process

from rest_framework import serializers

from eli_app.models import Act
from sejm_app.models.committee import CommitteeSitting
from sejm_app.models.envoy import Envoy
from sejm_app.models.interpellation import Interpellation, Reply
from sejm_app.models.print_model import PrintModel
from sejm_app.models.vote import Vote
from .list_serializers import *
from .detail_serializers import *