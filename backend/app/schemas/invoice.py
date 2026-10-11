"""
Pydantic schemas: the API's public contract. Kept separate from the
SQLAlchemy models (app/models) so DB structure can change without
breaking the API response shape, and vice versa.
"""

from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class LineItemSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    description: Optional[str] = None
    quantity: Optional[Decimal] = None
    unit_price: Optional[Decimal] = None
    amount: Optional[Decimal] = None


class InvoiceBase(BaseModel):
    vendor: Optional[str] = None
    invoice_number: Optional[str] = None
    invoice_date: Optional[date] = None
    currency: str = "USD"
    subtotal: Optional[Decimal] = None
    discount: Optional[Decimal] = None
    tax: Optional[Decimal] = None
    total: Optional[Decimal] = None


class InvoiceResponse(InvoiceBase):
    model_config = ConfigDict(from_attributes=True)

    needs_review: bool
    review_notes: Optional[str] = None
    
    id: UUID
    file_url: str
    created_at: datetime
    line_items: list[LineItemSchema] = []


class ExtractedInvoiceData(InvoiceBase):
    """
    Shape returned by any extractor implementation (Gemini, etc).
    This is the contract every extractor.extract() call must satisfy,
    which is what makes extractors swappable.
    """
    line_items: list[LineItemSchema] = []