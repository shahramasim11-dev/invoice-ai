"""
Central configuration. All environment variables flow through this one
Settings class instead of scattered os.getenv() calls across the codebase.
"""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # --- Database (Supabase Postgres connection string) ---
    database_url: str

    # --- Supabase (for Storage) ---
    supabase_url: str
    supabase_key: str
    supabase_bucket: str = "invoices"

    # --- Gemini ---
    gemini_api_key: str
    gemini_model: str = "gemini-2.0-flash"

    # --- App ---
    environment: str = "development"
    cors_origins: list[str] = ["http://localhost:3000"]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    """
    Cached so we parse the .env file once per process, not on every request.
    Import this function (not Settings directly) wherever config is needed.
    """
    return Settings()