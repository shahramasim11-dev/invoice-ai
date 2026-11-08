import type { Invoice } from "@/types/invoice";

export interface VendorSpend {
  vendor: string;
  total: number;
}

export interface MonthSpend {
  month: string; // "2026-10", sortable
  label: string; // "Oct 2026", for display
  total: number;
}

/** Money is summed in whole cents so 0.1 + 0.2 style rounding errors can't creep in. */
function toCents(value: string | null): number {
  if (value === null) return 0;
  const amount = Number(value);
  return Number.isFinite(amount) ? Math.round(amount * 100) : 0;
}

/**
 * Turns a list of invoices into the numbers the dashboard shows.
 * Amounts in different currencies can't be added together, so only the
 * most common currency is analysed; the rest are counted and reported.
 */
export class InvoiceAnalytics {
  readonly currency: string;
  readonly excludedCount: number;
  private readonly invoices: Invoice[];

  constructor(all: Invoice[]) {
    this.currency = InvoiceAnalytics.dominantCurrency(all);
    this.invoices = all.filter((invoice) => invoice.currency === this.currency);
    this.excludedCount = all.length - this.invoices.length;
  }

  get invoiceCount(): number {
    return this.invoices.length;
  }

  get totalSpend(): number {
    return this.sumCents(this.invoices) / 100;
  }

  get needsReviewCount(): number {
    return this.invoices.filter((invoice) => invoice.needs_review).length;
  }

  spendByVendor(limit = 8): VendorSpend[] {
    const groups = new Map<string, { vendor: string; cents: number }>();
    for (const invoice of this.invoices) {
      const name = (invoice.vendor ?? "Unknown vendor").trim() || "Unknown vendor";
      const key = name.toLowerCase();
      const group = groups.get(key) ?? { vendor: name, cents: 0 };
      group.cents += toCents(invoice.total);
      groups.set(key, group);
    }
    return [...groups.values()]
      .sort((a, b) => b.cents - a.cents)
      .slice(0, limit)
      .map((group) => ({ vendor: group.vendor, total: group.cents / 100 }));
  }

  /** Invoices without a date can't be placed on a timeline, so they're skipped. */
  spendByMonth(): MonthSpend[] {
    const months = new Map<string, number>();
    for (const invoice of this.invoices) {
      if (!invoice.invoice_date) continue;
      const month = invoice.invoice_date.slice(0, 7);
      months.set(month, (months.get(month) ?? 0) + toCents(invoice.total));
    }
    return [...months.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, cents]) => {
        const [year, monthNumber] = month.split("-").map(Number);
        const label = new Date(year, monthNumber - 1, 1).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        return { month, label, total: cents / 100 };
      });
  }

  private sumCents(invoices: Invoice[]): number {
    return invoices.reduce((sum, invoice) => sum + toCents(invoice.total), 0);
  }

  private static dominantCurrency(invoices: Invoice[]): string {
    const counts = new Map<string, number>();
    for (const invoice of invoices) {
      counts.set(invoice.currency, (counts.get(invoice.currency) ?? 0) + 1);
    }
    let best = "USD";
    let bestCount = 0;
    for (const [currency, count] of counts) {
      if (count > bestCount) {
        best = currency;
        bestCount = count;
      }
    }
    return best;
  }
}