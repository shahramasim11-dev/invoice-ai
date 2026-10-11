import csv
import io

from app.models.invoice import Invoice
from app.services.export.base_exporter import AbstractExporter

HEADERS = [
    "Vendor", "Invoice #", "Date", "Currency", "Subtotal", "Discount",
    "Tax", "Total", "Needs review", "Review notes", "File URL",
]


class CsvExporter(AbstractExporter):
    media_type = "text/csv"
    file_extension = "csv"

    def export(self, invoices: list[Invoice]) -> bytes:
        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow(HEADERS)
        for inv in invoices:
            row = (
                inv.vendor, inv.invoice_number, inv.invoice_date, inv.currency,
                inv.subtotal, inv.discount, inv.tax, inv.total,
                inv.needs_review, inv.review_notes, inv.file_url,
            )
            writer.writerow([self.sanitize(v) for v in row])
        # utf-8-sig adds a marker so Excel reads accents and symbols correctly
        return buffer.getvalue().encode("utf-8-sig")