from abc import ABC, abstractmethod
from datetime import date

from app.schemas.search import InvoiceSearchFilters


class QueryParseError(Exception):
    """Raised when a search sentence cannot be turned into filters."""


class AbstractQueryParser(ABC):
    @abstractmethod
    def parse(self, query: str, today: date) -> InvoiceSearchFilters:
        """Turn a natural-language query into structured filters."""
        raise NotImplementedError