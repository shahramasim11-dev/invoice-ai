"use client";

import { useMemo, type ReactNode } from "react";
import { InvoiceAnalytics } from "@/lib/analytics";
import { formatMoney } from "@/lib/format";
import type { Invoice } from "@/types/invoice";
import MonthlySpendChart from "@/components/MonthlySpendChart";
import VendorSpendChart from "@/components/VendorSpendChart";

interface AnalyticsPanelProps {
  invoices: Invoice[];
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 font-medium">{title}</h3>
      {children}
    </div>
  );
}

export default function AnalyticsPanel({ invoices }: AnalyticsPanelProps) {
  // Recompute only when the invoice list changes, not on every re-render.
  const analytics = useMemo(() => new InvoiceAnalytics(invoices), [invoices]);

  if (invoices.length === 0) return null;

  const months = analytics.spendByMonth();

  return (
    <section className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total spend"
          value={formatMoney(analytics.totalSpend, analytics.currency)}
        />
        <StatCard label="Invoices" value={String(analytics.invoiceCount)} />
        <StatCard label="Need review" value={String(analytics.needsReviewCount)} />
      </div>

      {analytics.excludedCount > 0 && (
        <p className="text-sm text-slate-500">
          Showing {analytics.currency} only.{" "}
          {analytics.excludedCount === 1
            ? "1 invoice in another currency is"
            : `${analytics.excludedCount} invoices in other currencies are`}{" "}
          not included, since amounts in different currencies can&apos;t be added together.
        </p>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Spend by vendor">
          <VendorSpendChart data={analytics.spendByVendor()} currency={analytics.currency} />
        </ChartCard>
        <ChartCard title="Spend by month">
          {months.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">No dated invoices yet.</p>
          ) : (
            <MonthlySpendChart data={months} currency={analytics.currency} />
          )}
        </ChartCard>
      </div>
    </section>
  );
}