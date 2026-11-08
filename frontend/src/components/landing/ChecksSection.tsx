import StatusBadge from "@/components/StatusBadge";

interface SumProps {
  title: string;
  lines: [string, string][];
  needsReview: boolean;
  note?: string;
}

function Sum({ title, lines, needsReview, note }: SumProps) {
  return (
    <div className="border border-slate-300 bg-white p-5">
      <h3 className="text-sm font-medium">{title}</h3>
      <div className="mt-3 font-mono text-[13px] leading-6">
        {lines.map(([label, value], index) => (
          <div
            key={label}
            className={`flex justify-between gap-4 ${
              index === lines.length - 2 ? "mt-1 border-t border-dashed border-slate-300 pt-1" : ""
            }`}
          >
            <span>{label}</span>
            <span>{value}</span>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <StatusBadge needsReview={needsReview} notes={note ?? null} />
      </div>
      {note && <p className="mt-2 text-sm text-slate-600">{note}</p>}
    </div>
  );
}

export default function ChecksSection() {
  return (
    <section className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Numbers that don&apos;t add up get flagged
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-slate-600">
            AI can misread a receipt, so nothing is trusted blindly. Every invoice is checked:
            line items against the subtotal, then subtotal, discount and tax against the total.
          </p>
          <p className="mt-4 max-w-xl leading-relaxed text-slate-600">
            When something doesn&apos;t match, the invoice is marked Needs review with a note
            saying which numbers disagree. It&apos;s saved either way, so nothing is lost.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Sum
            title="The discount was read"
            needsReview={false}
            lines={[
              ["Subtotal", "53.26"],
              ["Discount", "-3.50"],
              ["Tax", "+2.36"],
              ["Expected total", "52.12"],
              ["Printed total", "52.12"],
            ]}
          />
          <Sum
            title="The discount was missed"
            needsReview={true}
            note="Subtotal - discount + tax = 55.62, but total is 52.12"
            lines={[
              ["Subtotal", "53.26"],
              ["Discount", "0.00"],
              ["Tax", "+2.36"],
              ["Expected total", "55.62"],
              ["Printed total", "52.12"],
            ]}
          />
        </div>
      </div>
    </section>
  );
}