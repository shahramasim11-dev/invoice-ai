import os
import uuid

from supabase import Client, create_client

from app.core.config import get_settings
from app.services.storage.base_storage import AbstractStorage, StorageError


class SupabaseStorage(AbstractStorage):
    def __init__(self):
        settings = get_settings()
        self._client: Client = create_client(settings.supabase_url, settings.supabase_key)
        self._bucket = settings.supabase_bucket

    def upload(self, file_bytes: bytes, filename: str, content_type: str) -> str:
        # Never trust user filenames as storage keys: spaces and special
        # characters can break them. Keep only the extension.
        extension = os.path.splitext(filename)[1].lower()
        stored_name = f"{uuid.uuid4()}{extension}"
        try:
            self._client.storage.from_(self._bucket).upload(
                stored_name, file_bytes, {"content-type": content_type}
            )
            return self._client.storage.from_(self._bucket).get_public_url(stored_name)
        except Exception as e:
            raise StorageError(f"Upload failed: {e}") from e