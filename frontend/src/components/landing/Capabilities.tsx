const CAPABILITIES = [
  {
    term: "Upload",
    description:
      "Drop in a PDF or a photo. The vendor, invoice number, date, currency, tax, total and every line item are filled in for you, and an invoice you've already uploaded is caught before it's saved.",
  },
  {
    term: "Search",
    description:
      "Ask in plain language, like “Amazon invoices over $500” or “flagged invoices from last month”. You see how your question was understood, so a misread is easy to spot.",
  },
  {
    term: "Analytics",
    description:
      "See total spend, spend by vendor and spend by month. The charts update as you upload.",
  },
  {
    term: "Export",
    description:
      "Download what's on screen as a CSV, or as an Excel workbook with invoices and line items on separate sheets.",
  },
];

export default function Capabilities() {
  return (
    <section className="border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold tracking-tight">From upload to spreadsheet</h2>
        <dl className="mt-8 border-t border-slate-200">
          {CAPABILITIES.map(({ term, description }) => (
            <div
              key={term}
              className="grid gap-2 border-b border-slate-200 py-6 md:grid-cols-[12rem_1fr] md:gap-8"
            >
              <dt className="font-medium">{term}</dt>
              <dd className="max-w-xl leading-relaxed text-slate-600">{description}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}