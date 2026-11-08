"""
GeminiGateway: the single place in the app that talks to Gemini. It applies
the retry policy to each model and, if a model stays unavailable, falls back
to the next one in the list. Callers just ask for text and get it.
"""
from typing import Any, Sequence

from google import genai
from google.genai import errors, types

from app.core.config import get_settings
from app.services.gemini_retry import RETRYABLE_CODES, RetryPolicy


class GeminiGateway:
    def __init__(
        self,
        api_key: str,
        models: Sequence[str],
        retry: RetryPolicy | None = None,
        timeout_seconds: float = 60,
        client: Any = None,  # injectable so tests can use a fake
    ):
        if not models:
            raise ValueError("GeminiGateway needs at least one model name.")
        self._models = list(models)
        self._retry = retry or RetryPolicy()
        self._client = client or genai.Client(
            api_key=api_key,
            http_options=types.HttpOptions(timeout=int(timeout_seconds * 1000)),
        )

    @classmethod
    def from_settings(cls) -> "GeminiGateway":
        settings = get_settings()
        models = [settings.gemini_model]
        fallback = settings.gemini_fallback_model
        if fallback and fallback != settings.gemini_model:
            models.append(fallback)
        return cls(settings.gemini_api_key, models)

    def generate_text(
        self, contents: Any, config: types.GenerateContentConfig | None = None
    ) -> str:
        last_error: errors.APIError | None = None
        for model in self._models:
            try:
                response = self._retry.run(
                    lambda model=model: self._client.models.generate_content(
                        model=model, contents=contents, config=config
                    )
                )
                return response.text or ""
            except errors.APIError as e:
                if e.code not in RETRYABLE_CODES:
                    raise  # a real error (bad request, bad key): don't switch models
                last_error = e  # this model is busy: try the next one
        assert last_error is not None
        raise last_error