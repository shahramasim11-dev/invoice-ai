"""
InvoiceRepository: the ONLY place in the app that writes SQLAlchemy
queries against Invoice/LineItem. Services call this instead of touching
the database themselves, which keeps persistence logic in one testable place.
"""
from decimal import Decimal
from uuid import UUID

from sqlalchemy.orm import Session, selectinload

from app.models.invoice import Invoice, LineItem
from app.schemas.invoice import ExtractedInvoiceData
from app.schemas.search import InvoiceSearchFilters

class InvoiceRepository:
    def __init__(self, db: Session):
        self._db = db

    def create(
        self, data: ExtractedInvoiceData, file_url: str, raw_extraction: str, review_notes: list[str] | None = None
    ) -> Invoice: 
        notes = review_notes or []
        invoice = Invoice(
            vendor=data.vendor,
            invoice_number=data.invoice_number,
            invoice_date=data.invoice_date,
            currency=data.currency,
            subtotal=data.subtotal,
            discount=data.discount,
            tax=data.tax,
            total=data.total,
            file_url=file_url,
            raw_extraction=raw_extraction,
            needs_review=bool(notes),
            review_notes="; ".join(notes) or None,
        )
        invoice.line_items = [
            LineItem(
                description=item.description,
                quantity=item.quantity,
                unit_price=item.unit_price,
                amount=item.amount,
            )
            for item in data.line_items
        ]
        try:
            self._db.add(invoice)
            self._db.commit()
        except Exception:
            self._db.rollback()
            raise
        self._db.refresh(invoice)
        return invoice

    def get_by_id(self, invoice_id: UUID) -> Invoice | None:
        return self._db.query(Invoice).filter(Invoice.id == invoice_id).first()

    def list_all(
        self, vendor: str | None = None, min_total: Decimal | None = None
    ) -> list[Invoice]:
        return self.search(InvoiceSearchFilters(vendor=vendor, min_total=min_total))

    def search(self, filters: InvoiceSearchFilters) -> list[Invoice]:
        query = self._db.query(Invoice).options(selectinload(Invoice.line_items))
        if filters.vendor:
            query = query.filter(Invoice.vendor.ilike(f"%{filters.vendor}%"))
        if filters.min_total is not None:
            query = query.filter(Invoice.total >= filters.min_total)
        if filters.max_total is not None:
            query = query.filter(Invoice.total <= filters.max_total)
        if filters.date_from is not None:
            query = query.filter(Invoice.invoice_date >= filters.date_from)
        if filters.date_to is not None:
            query = query.filter(Invoice.invoice_date <= filters.date_to)
        if filters.currency:
            query = query.filter(Invoice.currency == filters.currency.upper())
        if filters.needs_review is not None:
            query = query.filter(Invoice.needs_review == filters.needs_review)
        return query.order_by(
            Invoice.invoice_date.desc().nulls_last(), Invoice.created_at.desc()
        ).all()

    def find_duplicate(
        self, vendor: str | None, invoice_number: str | None
    ) -> Invoice | None:
        if not vendor or not invoice_number:
            return None
        return (
            self._db.query(Invoice)
            .filter(Invoice.vendor == vendor, Invoice.invoice_number == invoice_number)
            .first()
        )