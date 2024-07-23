from .update_acts import ActUpdaterTask
from .update_helpers import (
    ActStatusUpdaterTask,
    InstitutionUpdaterTask,
    KeywordUpdaterTask,
    PublisherUpdaterTask,
    ReferenceUpdaterTask,
)

tasks = (
    ActStatusUpdaterTask(),
    InstitutionUpdaterTask(),
    KeywordUpdaterTask(),
    PublisherUpdaterTask(),
    ReferenceUpdaterTask(),
    ActUpdaterTask(),
)
