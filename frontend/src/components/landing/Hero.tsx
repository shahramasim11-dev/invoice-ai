import Link from "next/link";
import ReceiptDemo from "@/components/landing/ReceiptDemo";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[1fr_1.25fr] lg:py-24">
      <div>
        <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
          Stop typing invoices manually.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
          Let AI extract and organize them in seconds. Upload a PDF or a photo, and InvoiceAI
          fills in the vendor, dates, totals and line items, checks that the numbers add up,
          and keeps everything searchable.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-5">
          <Link
            href="/dashboard"
            className="rounded-md bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            Upload an invoice
          </Link>
          <a
            href="#pricing"
            className="font-medium text-slate-700 underline underline-offset-4 hover:text-slate-900"
          >
            See pricing
          </a>
        </div>
        <p className="mt-4 text-sm text-slate-500">PDF, JPG, PNG or WebP, up to 10 MB.</p>
      </div>
      <ReceiptDemo />
    </section>
  );
}