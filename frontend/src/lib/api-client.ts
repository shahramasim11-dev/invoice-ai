import type { Invoice, SearchFilters, SearchResult } from "@/types/invoice";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export interface InvoiceFilters {
  vendor?: string;
  minTotal?: number;
}

/**
 * The ONLY place in the frontend that talks to the backend. Components
 * call these methods and never use fetch() themselves, the same way
 * routes only talk to the service layer on the backend.
 */
export class ApiClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, "");
  }

  listInvoices(filters: InvoiceFilters = {}): Promise<Invoice[]> {
    const query = this.buildQuery({
      vendor: filters.vendor,
      min_total: filters.minTotal,
    });
    return this.request<Invoice[]>(`/invoices${query}`);
  }

  getInvoice(id: string): Promise<Invoice> {
    return this.request<Invoice>(`/invoices/${id}`);
  }

  uploadInvoice(file: File): Promise<Invoice> {
    const body = new FormData();
    body.append("file", file); // must match the backend parameter name
    // No Content-Type header: the browser sets it, including the
    // multipart boundary. Setting it by hand breaks the upload.
    return this.request<Invoice>("/invoices/upload", { method: "POST", body });
  }

  search(query: string): Promise<SearchResult> {
    return this.request<SearchResult>(`/search${this.buildQuery({ q: query })}`);
  }

  /** Pass a search's filters to export exactly those results. */
  exportUrl(format: "csv" | "xlsx", filters: SearchFilters | null = null): string {
    return `${this.baseUrl}/invoices/export${this.buildQuery({ format, ...filters })}`;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, init);
    } catch {
      throw new ApiError(0, "Cannot reach the server. Is the backend running?");
    }
    if (!response.ok) {
      throw new ApiError(response.status, await this.readErrorMessage(response));
    }
    return (await response.json()) as T;
  }

  private async readErrorMessage(response: Response): Promise<string> {
    try {
      const body = await response.json();
      if (typeof body.detail === "string") return body.detail;
    } catch {
      // body wasn't JSON; fall through to the generic message
    }
    return `Request failed (${response.status})`;
  }

  private buildQuery(
    params: Record<string, string | number | boolean | null | undefined>
  ): string {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== "") {
        query.set(key, String(value));
      }
    }
    const text = query.toString();
    return text ? `?${text}` : "";
  }
}

export const apiClient = new ApiClient(
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"
);