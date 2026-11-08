"use client";

import { useCallback, useEffect, useState } from "react";
import { apiClient, ApiError } from "@/lib/api-client";
import type { Invoice, SearchFilters } from "@/types/invoice";
import ExportButtons from "@/components/ExportButtons";
import InterpretedFilters from "@/components/InterpretedFilters";
import InvoiceTable from "@/components/InvoiceTable";
import SearchBar from "@/components/SearchBar";
import UploadDropzone from "@/components/UploadDropzone";
import AnalyticsPanel from "@/components/AnalyticsPanel";

interface ActiveSearch {
  query: string;
  filters: SearchFilters;
  invoices: Invoice[];
}

export default function DashboardPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState<ActiveSearch | null>(null);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const loadInvoices = useCallback(async () => {
    try {
      setInvoices(await apiClient.listInvoices());
      setError(null);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  async function handleSearch(query: string) {
    setSearching(true);
    setSearchError(null);
    try {
      const result = await apiClient.search(query);
      setSearch({
        query,
        filters: result.interpreted_filters,
        invoices: result.invoices,
      });
    } catch (e) {
      setSearchError(e instanceof ApiError ? e.message : "Search failed.");
    } finally {
      setSearching(false);
    }
  }

  function handleClear() {
    setSearch(null);
    setSearchError(null);
  }

  function handleUploaded(invoice: Invoice) {
    setSearch(null); // leave search mode so the new invoice is visible
    setInvoices((current) => [invoice, ...current]);
  }

  const visibleInvoices = search ? search.invoices : invoices;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <header>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-slate-500">Upload invoices and let AI organize them.</p>
        </header>

        {!loading && !error && <AnalyticsPanel invoices={invoices} />}

        <UploadDropzone onUploaded={handleUploaded} />

        <section className="space-y-3">
          <SearchBar
            busy={searching}
            active={search !== null}
            onSearch={handleSearch}
            onClear={handleClear}
          />
          {searchError && (
            <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {searchError}
            </p>
          )}
          {search && (
            <InterpretedFilters
              query={search.query}
              filters={search.filters}
              count={search.invoices.length}
            />
          )}
        </section>

        {loading && <p className="text-slate-500">Loading invoices…</p>}
        {error && (
          <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}
        {!loading && !error && (
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">
                {search ? "Search results" : "All invoices"}
              </h2>
              <ExportButtons filters={search?.filters ?? null} />
            </div>
            <InvoiceTable
              invoices={visibleInvoices}
              emptyMessage={search ? "No invoices match that search." : undefined}
            />
          </section>
        )}
      </main>
    </div>
  );
}