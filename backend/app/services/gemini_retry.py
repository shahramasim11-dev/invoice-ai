"""
Retry policy for calls to Gemini. Free-tier models regularly answer with
503 (overloaded) or 429 (rate limited) for a few seconds; waiting briefly
and trying again usually succeeds.
"""
import random
import time
from typing import Callable, TypeVar

from google.genai import errors

T = TypeVar("T")

RETRYABLE_CODES = {429, 500, 502, 503, 504}


class RetryPolicy:
    def __init__(self, attempts: int = 3, base_delay: float = 1.0):
        self._attempts = attempts
        self._base_delay = base_delay

    def run(self, operation: Callable[[], T]) -> T:
        for attempt in range(1, self._attempts):
            try:
                return operation()
            except errors.APIError as e:
                if e.code not in RETRYABLE_CODES:
                    raise
                delay = self._base_delay * 2 ** (attempt - 1)
                time.sleep(delay + random.uniform(0, 0.5))
        return operation()  # last attempt: any error propagates to the caller