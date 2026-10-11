from datetime import date
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel

from app.schemas.invoice import InvoiceResponse


class InvoiceSearchFilters(BaseModel):
    """The ONLY thing the AI is allowed to produce for a search."""
    vendor: Optional[str] = None
    min_total: Optional[Decimal] = None
    max_total: Optional[Decimal] = None
    date_from: Optional[date] = None
    date_to: Optional[date] = None
    currency: Optional[str] = None
    needs_review: Optional[bool] = None


class SearchResponse(BaseModel):
    interpreted_filters: InvoiceSearchFilters
    invoices: list[InvoiceResponse]