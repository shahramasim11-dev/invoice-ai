import type { Invoice } from "@/types/invoice";
import { formatDate, formatMoney } from "@/lib/format";
import StatusBadge from "@/components/StatusBadge";

interface InvoiceTableProps {
  invoices: Invoice[];
  emptyMessage?: string;
}

export default function InvoiceTable({
  invoices,
  emptyMessage = "No invoices yet. Upload one above to get started.",
}: InvoiceTableProps) {
  if (invoices.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Vendor</th>
            <th className="px-4 py-3">Invoice #</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3 text-right">Total</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">File</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 font-medium">{invoice.vendor ?? "Unknown vendor"}</td>
              <td className="px-4 py-3 text-slate-600">{invoice.invoice_number ?? "—"}</td>
              <td className="px-4 py-3 text-slate-600">{formatDate(invoice.invoice_date)}</td>
              <td className="px-4 py-3 text-right tabular-nums">
                {formatMoney(invoice.total, invoice.currency)}
              </td>
              <td className="px-4 py-3">
                <StatusBadge needsReview={invoice.needs_review} notes={invoice.review_notes} />
              </td>
              <td className="px-4 py-3">
                <a
                  href={invoice.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}