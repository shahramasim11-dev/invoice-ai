from app.schemas.invoice import ExtractedInvoiceData
from app.services.validation.invoice_validator import InvoiceValidator

validator = InvoiceValidator()

good = ExtractedInvoiceData(
    vendor="A", invoice_date="2026-10-09",
    subtotal="53.26", discount="3.50", tax="2.36", total="52.12",
    line_items=[{"amount": "50.00"}, {"amount": "3.26"}],
)
bad = good.model_copy(update={"discount": None})  # the bug we fixed earlier
empty = ExtractedInvoiceData()

print("good:", validator.validate(good))
print("bad:", validator.validate(bad))
print("empty:", validator.validate(empty))