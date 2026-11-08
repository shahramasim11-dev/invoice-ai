"""
The one place where concrete implementations are chosen. Everything else
in the app depends on the abstract interfaces. To switch AI providers or
storage backends, you change the lines in this file and nothing else.
"""
from functools import lru_cache

from fastapi import Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.repositories.invoice_repository import InvoiceRepository
from app.services.extractor.base_extractor import AbstractExtractor
from app.services.extractor.gemini_extractor import GeminiExtractor
from app.services.invoice_service import InvoiceService
from app.services.storage.base_storage import AbstractStorage
from app.services.storage.supabase_storage import SupabaseStorage
from app.services.validation.invoice_validator import InvoiceValidator

from app.services.export.base_exporter import AbstractExporter
from app.services.export.csv_exporter import CsvExporter
from app.services.export.excel_exporter import ExcelExporter

from app.services.search.base_query_parser import AbstractQueryParser
from app.services.search.gemini_query_parser import GeminiQueryParser
from app.services.search_service import SearchService

from app.services.gemini_gateway import GeminiGateway

@lru_cache
def get_gateway() -> GeminiGateway:
    return GeminiGateway.from_settings()

@lru_cache
def get_extractor() -> AbstractExtractor:
    return GeminiExtractor(get_gateway())

@lru_cache
def get_storage() -> AbstractStorage:
    return SupabaseStorage()

@lru_cache
def get_validator() -> InvoiceValidator:
    return InvoiceValidator()

@lru_cache
def get_query_parser() -> AbstractQueryParser:
    return GeminiQueryParser(get_gateway())

@lru_cache
def get_exporters() -> dict[str, AbstractExporter]:
    return {"csv": CsvExporter(), "xlsx": ExcelExporter()}


def get_invoice_service(
    db: Session = Depends(get_db),
    extractor: AbstractExtractor = Depends(get_extractor),
    storage: AbstractStorage = Depends(get_storage),
    validator: InvoiceValidator = Depends(get_validator),
) -> InvoiceService:
    return InvoiceService(extractor, storage, InvoiceRepository(db), validator)

def get_search_service(
    db: Session = Depends(get_db),
    parser: AbstractQueryParser = Depends(get_query_parser),
) -> SearchService:
    return SearchService(parser, InvoiceRepository(db))