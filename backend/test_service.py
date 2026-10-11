from app.core.database import SessionLocal
from app.repositories.invoice_repository import InvoiceRepository
from app.schemas.invoice import ExtractedInvoiceData
from app.services.extractor.base_extractor import AbstractExtractor
from app.services.invoice_service import DuplicateInvoiceError, InvoiceService
from app.services.storage.base_storage import AbstractStorage
from app.services.validation.invoice_validator import InvoiceValidator



class FakeExtractor(AbstractExtractor):
    def extract(self, file_bytes, mime_type):
        return ExtractedInvoiceData(vendor="Fake Co", invoice_number="F-1", total="25")


class FakeStorage(AbstractStorage):
    def upload(self, file_bytes, filename, content_type):
        return f"http://fake.local/{filename}"


db = SessionLocal()
service = InvoiceService(FakeExtractor(), FakeStorage(), InvoiceRepository(db), InvoiceValidator())

invoice = service.process_upload(b"x", "a.pdf", "application/pdf")
print("saved:", invoice.vendor, invoice.file_url)

try:
    service.process_upload(b"x", "a.pdf", "application/pdf")
except DuplicateInvoiceError as e:
    print("duplicate blocked:", e)

db.delete(invoice)
db.commit()
db.close()
print("cleaned up")