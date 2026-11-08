/**
 * TypeScript mirrors of the backend's Pydantic schemas. If the backend
 * response shape changes, this is the one file to update, and the editor
 * will then flag every component that used a field that no longer exists.
 *
 * Money fields are strings: the backend serializes Decimal values as
 * strings (e.g. "52.12") to avoid floating-point rounding in transit.
 */
export interface LineItem {
  description: string | null;
  quantity: string | null;
  unit_price: string | null;
  amount: string | null;
}

export interface Invoice {
  id: string;
  vendor: string | null;
  invoice_number: string | null;
  invoice_date: string | null; // "YYYY-MM-DD"
  currency: string;
  subtotal: string | null;
  discount: string | null;
  tax: string | null;
  total: string | null;
  file_url: string;
  created_at: string; // ISO timestamp
  needs_review: boolean;
  review_notes: string | null;
  line_items: LineItem[];
}

export interface SearchFilters {
  vendor: string | null;
  min_total: string | null;
  max_total: string | null;
  date_from: string | null;
  date_to: string | null;
  currency: string | null;
  needs_review: boolean | null;
}

export interface SearchResult {
  interpreted_filters: SearchFilters;
  invoices: Invoice[];
}