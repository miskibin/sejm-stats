from .club_updater import ClubUpdaterTask
from .committees_updater import CommitteeUpdaterTask
from .db_updater_task import DbUpdaterTask
from .envoy_updater import EnvoyUpdaterTask
from .interpellations_updater import InterpellationsUpdaterTask
from .prints_updater import PrintsUpdaterTask
from .processes_updater import ProcessesUpdaterTask
from .votings_updater import VotingsUpdaterTask

tasks = (
    ClubUpdaterTask(),
    EnvoyUpdaterTask(),
    PrintsUpdaterTask(),
    VotingsUpdaterTask(),
    InterpellationsUpdaterTask(),
    ProcessesUpdaterTask(),
    CommitteeUpdaterTask(),
)
