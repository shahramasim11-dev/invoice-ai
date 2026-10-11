from decimal import Decimal
from uuid import UUID
from typing import Literal

from fastapi import APIRouter, Depends, File, HTTPException, Query, Response, UploadFile

from app.api.deps import get_invoice_service
from app.schemas.invoice import InvoiceResponse
from app.services.extractor.base_extractor import ExtractionError
from app.services.invoice_service import (
    DuplicateInvoiceError,
    InvoiceNotFoundError,
    InvoiceService,
)
from app.services.storage.base_storage import StorageError
from app.api.deps import get_exporters, get_invoice_service
from app.services.export.base_exporter import AbstractExporter

router = APIRouter(prefix="/invoices", tags=["invoices"])

ALLOWED_TYPES = {"application/pdf", "image/jpeg", "image/png", "image/webp"}
MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("/upload", response_model=InvoiceResponse, status_code=201)
def upload_invoice(
    file: UploadFile = File(...),
    service: InvoiceService = Depends(get_invoice_service),
):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(415, "Upload a PDF, JPG, PNG, or WebP file.")

    file_bytes = file.file.read()
    if len(file_bytes) > MAX_UPLOAD_BYTES:
        raise HTTPException(413, "File is larger than 10 MB.")

    try:
        return service.process_upload(
            file_bytes, file.filename or "upload", file.content_type
        )
    except DuplicateInvoiceError as e:
        raise HTTPException(409, str(e))
    except (ExtractionError, StorageError) as e:
        raise HTTPException(502, str(e))


@router.get("", response_model=list[InvoiceResponse])
def list_invoices(
    vendor: str | None = Query(default=None),
    min_total: Decimal | None = Query(default=None),
    service: InvoiceService = Depends(get_invoice_service),
):
    return service.list_invoices(vendor=vendor, min_total=min_total)

@router.get("/export")
def export_invoices(
    file_format: Literal["csv", "xlsx"] = Query(default="csv", alias="format"),
    vendor: str | None = Query(default=None),
    min_total: Decimal | None = Query(default=None),
    service: InvoiceService = Depends(get_invoice_service),
    exporters: dict[str, AbstractExporter] = Depends(get_exporters),
):
    invoices = service.list_invoices(vendor=vendor, min_total=min_total)
    exporter = exporters[file_format]
    return Response(
        content=exporter.export(invoices),
        media_type=exporter.media_type,
        headers={
            "Content-Disposition": f'attachment; filename="invoices.{exporter.file_extension}"'
        },
    )

@router.get("/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(
    invoice_id: UUID, service: InvoiceService = Depends(get_invoice_service)
):
    try:
        return service.get_invoice(invoice_id)
    except InvoiceNotFoundError as e:
        raise HTTPException(404, str(e))