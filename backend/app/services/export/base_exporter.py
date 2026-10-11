"""
AbstractExporter: turns a list of invoices into file bytes. Each format
(CSV, Excel, ...) is one subclass, so adding a format never touches
existing code.
"""
from abc import ABC, abstractmethod
from typing import Any

from app.models.invoice import Invoice


class AbstractExporter(ABC):
    media_type: str
    file_extension: str

    @abstractmethod
    def export(self, invoices: list[Invoice]) -> bytes:
        raise NotImplementedError

    @staticmethod
    def sanitize(value: Any) -> Any:
        """
        Spreadsheet apps run text starting with = + - @ as a formula. Our
        text comes from AI reading arbitrary documents, so a malicious
        invoice could plant a formula in the vendor name. A leading
        apostrophe forces the cell to be treated as plain text.
        """
        if isinstance(value, str) and value[:1] in ("=", "+", "-", "@", "\t", "\r"):
            return "'" + value
        return value