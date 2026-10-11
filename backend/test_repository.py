from decimal import Decimal

from app.core.database import SessionLocal
from app.repositories.invoice_repository import InvoiceRepository
from app.schemas.invoice import ExtractedInvoiceData

db = SessionLocal()
repo = InvoiceRepository(db)

data = ExtractedInvoiceData(
    vendor="Test Co",
    invoice_number="T-1",
    total="100",
    subtotal="100",
    line_items=[
        {"description": "Widget", "quantity": 2, "unit_price": 50, "amount": 100}
    ],
)

invoice = repo.create(data, "http://example.com/x.pdf", "{}")
print("created:", invoice.id, "| line items:", len(invoice.line_items))
print("duplicate found:", repo.find_duplicate("Test Co", "T-1") is not None)
print("vendor search 'test':", [i.vendor for i in repo.list_all(vendor="test")])
print("min_total 500:", repo.list_all(min_total=Decimal("500")))

db.delete(invoice)
db.commit()
print("cleaned up")
db.close()