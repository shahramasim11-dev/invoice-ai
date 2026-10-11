"""
Core domain models. Invoice has many LineItems (one-to-many).
"""

from sqlalchemy import Column, String, Numeric, Date, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.models.base import BaseModel


class Invoice(BaseModel):
    __tablename__ = "invoices"

    vendor = Column(String, nullable=True, index=True)
    invoice_number = Column(String, nullable=True)
    invoice_date = Column(Date, nullable=True)
    currency = Column(String, default="USD")
    subtotal = Column(Numeric(12, 2), nullable=True)
    discount = Column(Numeric(12, 2), nullable=True)
    tax = Column(Numeric(12, 2), nullable=True)
    total = Column(Numeric(12, 2), nullable=True, index=True)
    file_url = Column(String, nullable=False)        # Supabase Storage URL
    raw_extraction = Column(String, nullable=True)   # raw JSON from Gemini, for debugging
    needs_review = Column(Boolean, default=False, nullable=False, index=True)
    review_notes = Column(String, nullable=True)

    line_items = relationship(
        "LineItem", back_populates="invoice", cascade="all, delete-orphan"
    )


class LineItem(BaseModel):
    __tablename__ = "line_items"

    invoice_id = Column(UUID(as_uuid=True), ForeignKey("invoices.id"), nullable=False)
    description = Column(String, nullable=True)
    quantity = Column(Numeric(12, 2), nullable=True)
    unit_price = Column(Numeric(12, 2), nullable=True)
    amount = Column(Numeric(12, 2), nullable=True)

    invoice = relationship("Invoice", back_populates="line_items")