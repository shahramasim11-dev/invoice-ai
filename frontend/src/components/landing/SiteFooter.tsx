import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-slate-500">
        <p>
          InvoiceAI is a portfolio project: a FastAPI backend, a Next.js frontend, and Gemini
          for reading documents.
        </p>
        <Link href="/dashboard" className="font-medium text-slate-700 hover:text-slate-900">
          Open dashboard
        </Link>
      </div>
    </footer>
  );
}