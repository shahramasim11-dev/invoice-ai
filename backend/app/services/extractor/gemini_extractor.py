"""
Concrete extractor using Gemini's multimodal understanding. Gemini reads
the PDF/image directly and returns structured JSON, so there is no
separate OCR step.
"""
import json

from google.genai import errors, types
from pydantic import ValidationError

from app.schemas.invoice import ExtractedInvoiceData
from app.services.extractor.base_extractor import AbstractExtractor, ExtractionError
from app.services.gemini_gateway import GeminiGateway
from app.services.gemini_retry import RETRYABLE_CODES

EXTRACTION_PROMPT = """
You are an invoice/receipt data extraction engine. Read the attached document
and return ONLY a single JSON object with this exact shape:

{
  "vendor": string or null,
  "invoice_number": string or null,
  "invoice_date": "YYYY-MM-DD" or null,
  "currency": string (3-letter code, default "USD"),
  "subtotal": number or null,
  "discount": number or null,
  "tax": number or null,
  "total": number or null,
  "line_items": [
    {"description": string, "quantity": number or null,
     "unit_price": number or null, "amount": number or null}
  ]
}

"subtotal" is the sum of line items before discounts and tax. "discount" is
the total of all discounts, coupons, or member savings, as a POSITIVE number.
If a field is not present in the document, use null. Do not invent values.
"""


class GeminiExtractor(AbstractExtractor):
    def __init__(self, gateway: GeminiGateway):
        self._gateway = gateway

    def extract(self, file_bytes: bytes, mime_type: str) -> ExtractedInvoiceData:
        try:
            text = self._gateway.generate_text(
                [
                    types.Part.from_bytes(data=file_bytes, mime_type=mime_type),
                    EXTRACTION_PROMPT,
                ],
                types.GenerateContentConfig(response_mime_type="application/json"),
            )
            return ExtractedInvoiceData(**json.loads(text))
        except (json.JSONDecodeError, ValidationError, TypeError) as e:
            raise ExtractionError(f"Gemini returned unusable data: {e}") from e
        except errors.APIError as e:
            if e.code in RETRYABLE_CODES:
                raise ExtractionError(
                    "The AI service is busy right now. Please try again in a moment."
                ) from e
            raise ExtractionError(f"Gemini request failed: {e}") from e
        except Exception as e:
            raise ExtractionError(f"Gemini request failed: {e}") from e