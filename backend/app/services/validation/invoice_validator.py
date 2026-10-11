"""
InvoiceValidator checks extracted data for internal consistency.
It returns human-readable issues; an empty list means it looks fine.
It never raises: deciding what to DO about issues is the service's job.
"""
from decimal import Decimal

from app.schemas.invoice import ExtractedInvoiceData

ZERO = Decimal("0")


class InvoiceValidator:
    def __init__(self, tolerance: Decimal = Decimal("0.02")):
        self._tolerance = tolerance  # allows for rounding differences

    def validate(self, data: ExtractedInvoiceData) -> list[str]:
        return [
            *self._check_required_fields(data),
            *self._check_line_items_vs_subtotal(data),
            *self._check_total(data),
        ]

    def _matches(self, a: Decimal, b: Decimal) -> bool:
        return abs(a - b) <= self._tolerance

    def _check_required_fields(self, data: ExtractedInvoiceData) -> list[str]:
        required = {
            "vendor": data.vendor,
            "total": data.total,
            "invoice date": data.invoice_date,
        }
        return [f"Missing {label}" for label, value in required.items() if value is None]

    def _check_line_items_vs_subtotal(self, data: ExtractedInvoiceData) -> list[str]:
        amounts = [item.amount for item in data.line_items]
        if not amounts or None in amounts or data.subtotal is None:
            return []
        items_sum = sum(amounts, ZERO)
        if self._matches(items_sum, data.subtotal):
            return []
        return [f"Line items add up to {items_sum}, but subtotal is {data.subtotal}"]

    def _check_total(self, data: ExtractedInvoiceData) -> list[str]:
        if data.subtotal is None or data.total is None:
            return []
        expected = data.subtotal - (data.discount or ZERO) + (data.tax or ZERO)
        if self._matches(expected, data.total):
            return []
        return [f"Subtotal - discount + tax = {expected}, but total is {data.total}"]