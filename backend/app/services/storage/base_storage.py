"""
AbstractStorage: same swappability idea as AbstractExtractor. Today it's
Supabase Storage; it could become S3 or local disk later without
touching InvoiceService.
"""
from abc import ABC, abstractmethod


class StorageError(Exception):
    """Raised when a file cannot be stored."""


class AbstractStorage(ABC):
    @abstractmethod
    def upload(self, file_bytes: bytes, filename: str, content_type: str) -> str:
        """Store the file and return a URL where it can be viewed."""
        raise NotImplementedError