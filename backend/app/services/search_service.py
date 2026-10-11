from datetime import date

from app.models.invoice import Invoice
from app.repositories.invoice_repository import InvoiceRepository
from app.schemas.search import InvoiceSearchFilters
from app.services.search.base_query_parser import AbstractQueryParser


class SearchService:
    def __init__(self, parser: AbstractQueryParser, repository: InvoiceRepository):
        self._parser = parser
        self._repository = repository

    def search(self, query: str) -> tuple[InvoiceSearchFilters, list[Invoice]]:
        filters = self._parser.parse(query, date.today())
        return filters, self._repository.search(filters)