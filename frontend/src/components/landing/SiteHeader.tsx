import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          InvoiceAI
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <a href="#pricing" className="text-slate-600 hover:text-slate-900">
            Pricing
          </a>
          <Link
            href="/dashboard"
            className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700"
          >
            Open dashboard
          </Link>
        </nav>
      </div>
    </header>
  );
}