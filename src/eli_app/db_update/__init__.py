from .update_acts import ActUpdaterTask
from .update_helpers import (
    ActStatusUpdaterTask,
    InstitutionUpdaterTask,
    KeywordUpdaterTask,
    PublisherUpdaterTask,
    ReferenceUpdaterTask,
    
)
from .update_law import ActSectionUpdaterTask

tasks = (
    ActStatusUpdaterTask(),
    InstitutionUpdaterTask(),
    KeywordUpdaterTask(),
    PublisherUpdaterTask(),
    ReferenceUpdaterTask(),
    ActUpdaterTask(),
    ActSectionUpdaterTask(),
)
