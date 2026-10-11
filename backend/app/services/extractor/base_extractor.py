"""
AbstractExtractor defines the contract every document-extraction backend
must follow. Today it's Gemini; tomorrow it could be OpenAI or a local
model. As long as a new class implements extract(), nothing else in
the codebase needs to change. This is the Strategy pattern.
"""
from abc import ABC, abstractmethod

from app.schemas.invoice import ExtractedInvoiceData

class ExtractionError(Exception):
    """Raised when an extractor cannot produce valid invoice data."""

class AbstractExtractor(ABC):
    @abstractmethod
    def extract(self, file_bytes: bytes, mime_type: str) -> ExtractedInvoiceData:
        """
        Take raw file bytes (PDF or image) and return structured invoice data.
        Implementations own their own prompting / parsing / API calls.
        """
        raise NotImplementedError