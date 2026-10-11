import io
from typing import Iterable

from openpyxl import Workbook
from openpyxl.styles import Font
from openpyxl.worksheet.worksheet import Worksheet

from app.models.invoice import Invoice
from app.services.export.base_exporter import AbstractExporter
from app.services.export.csv_exporter import HEADERS as INVOICE_HEADERS

ITEM_HEADERS = ["Vendor", "Invoice #", "Description", "Quantity", "Unit price", "Amount"]


class ExcelExporter(AbstractExporter):
    media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    file_extension = "xlsx"

    def export(self, invoices: list[Invoice]) -> bytes:
        workbook = Workbook()

        invoice_sheet = workbook.active
        invoice_sheet.title = "Invoices"
        self._write_sheet(
            invoice_sheet, INVOICE_HEADERS, (self._invoice_row(i) for i in invoices)
        )

        item_sheet = workbook.create_sheet("Line Items")
        self._write_sheet(
            item_sheet,
            ITEM_HEADERS,
            (
                (inv.vendor, inv.invoice_number, item.description,
                 item.quantity, item.unit_price, item.amount)
                for inv in invoices
                for item in inv.line_items
            ),
        )

        buffer = io.BytesIO()
        workbook.save(buffer)
        return buffer.getvalue()

    @staticmethod
    def _invoice_row(inv: Invoice) -> tuple:
        return (
            inv.vendor, inv.invoice_number, inv.invoice_date, inv.currency,
            inv.subtotal, inv.discount, inv.tax, inv.total,
            inv.needs_review, inv.review_notes, inv.file_url,
        )

    def _write_sheet(self, sheet: Worksheet, headers: list[str], rows: Iterable) -> None:
        sheet.append(headers)
        for cell in sheet[1]:
            cell.font = Font(bold=True)
        sheet.freeze_panes = "A2"
        for row in rows:
            sheet.append([self.sanitize(v) for v in row])
        for column in sheet.columns:
            sheet.column_dimensions[column[0].column_letter].width = 20