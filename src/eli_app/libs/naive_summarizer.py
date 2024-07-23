import re

EMPTY_WORDS = [
    "zarządza się, co następuje:",
    "ogłasza się, co następuje :",
]
# Na podstawie*)
REGEX_TO_REMOVE = [
    r"Na podstawie art.*\)",
]
