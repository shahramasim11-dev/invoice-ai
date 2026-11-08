"""
InvoiceService: the orchestrator. It doesn't know or care WHICH extractor
or WHICH storage backend it's using; those are injected in __init__.
Swap GeminiExtractor for another extractor and this file never changes.
"""
from decimal import Decimal
from uuid import UUID

from app.models.invoice import Invoice
from app.repositories.invoice_repository import InvoiceRepository
from app.services.extractor.base_extractor import AbstractExtractor
from app.services.storage.base_storage import AbstractStorage
from app.services.validation.invoice_validator import InvoiceValidator
from app.schemas.search import InvoiceSearchFilters


class DuplicateInvoiceError(Exception):
    """Raised when an invoice with the same vendor + number already exists."""


class InvoiceNotFoundError(Exception):
    """Raised when an invoice ID doesn't exist."""


class InvoiceService:
    def __init__(
        self,
        extractor: AbstractExtractor,
        storage: AbstractStorage,
        repository: InvoiceRepository,
        validator: InvoiceValidator
    ):
        self._extractor = extractor
        self._storage = storage
        self._repository = repository
        self._validator = validator

    def process_upload(
        self, file_bytes: bytes, filename: str, content_type: str
    ) -> Invoice:
        extracted = self._extractor.extract(file_bytes, content_type)

        duplicate = self._repository.find_duplicate(
            extracted.vendor, extracted.invoice_number
        )
        if duplicate:
            raise DuplicateInvoiceError(
                f"Invoice {extracted.invoice_number} from {extracted.vendor} already exists."
            )

        file_url = self._storage.upload(file_bytes, filename, content_type)
        issues = self._validator.validate(extracted)
        file_url = self._storage.upload(file_bytes, filename, content_type)
        return self._repository.create(
            extracted, file_url, extracted.model_dump_json(), review_notes=issues
        )

    def list_invoices(
        self, vendor: str | None = None, min_total: Decimal | None = None
    ) -> list[Invoice]:
        return self._repository.list_all(vendor=vendor, min_total=min_total)

    def get_invoice(self, invoice_id: UUID) -> Invoice:
        invoice = self._repository.get_by_id(invoice_id)
        if invoice is None:
            raise InvoiceNotFoundError(f"Invoice {invoice_id} not found.")
        return invoice

    def search_invoices(self, filters: InvoiceSearchFilters) -> list[Invoice]:
        return self._repository.search(filters)