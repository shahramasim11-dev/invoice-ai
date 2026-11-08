import type { CSSProperties } from "react";
import StatusBadge from "@/components/StatusBadge";

const ITEMS: [string, string][] = [
  ["Organic Whole Milk 1 Gal", "4.49"],
  ["Haagen-Dazs Vanilla x2", "10.58"],
  ["Hass Avocado 4ct", "3.99"],
  ["Artisan Sourdough", "4.25"],
  ["Chicken Breast 2.4 lb", "11.98"],
  ["Sparkling Water 12pk", "5.99"],
  ["Dark Chocolate x3", "7.50"],
  ["Honeycrisp Apples 1.8 lb", "4.48"],
];

const TOTALS: [string, string][] = [
  ["Subtotal", "53.26"],
  ["Member discount", "-3.50"],
  ["Tax", "2.36"],
];

const FIELDS: [string, string][] = [
  ["Vendor", "FRESHMARKET EXPRESS"],
  ["Invoice number", "INV-2026-8842"],
  ["Date", "Oct 9, 2026"],
  ["Currency", "USD"],
  ["Subtotal", "$53.26"],
  ["Discount", "−$3.50"],
  ["Tax", "$2.36"],
  ["Total", "$52.12"],
  ["Line items", "8"],
];

function Row({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span>{left}</span>
      <span>{right}</span>
    </div>
  );
}

export default function ReceiptDemo() {
  return (
    <div className="grid gap-6 sm:grid-cols-[17rem_1fr]">
      <figure aria-hidden="true">
        <div className="border border-slate-300 bg-white p-5 font-mono text-[13px] leading-6">
          <p className="text-center font-medium">FRESHMARKET EXPRESS</p>
          <p className="text-center text-slate-500">INV-2026-8842 · Oct 9, 2026</p>
          <div className="my-3 border-t border-dashed border-slate-300" />
          {ITEMS.map(([name, price]) => (
            <Row key={name} left={name} right={price} />
          ))}
          <div className="my-3 border-t border-dashed border-slate-300" />
          {TOTALS.map(([name, amount]) => (
            <Row key={name} left={name} right={amount} />
          ))}
          <div className="mt-1 font-medium">
            <Row left="TOTAL" right="52.12" />
          </div>
        </div>
        <figcaption className="mt-2 text-sm text-slate-500">The receipt you upload</figcaption>
      </figure>

      <figure>
        <dl className="border border-slate-300 bg-white p-5 text-sm">
          {FIELDS.map(([label, value], index) => (
            <div
              key={label}
              style={{ "--i": index } as CSSProperties}
              className="fill-in flex justify-between gap-4 border-b border-slate-100 py-2 last:border-b-0"
            >
              <dt className="text-slate-500">{label}</dt>
              <dd className="text-right font-medium tabular-nums">{value}</dd>
            </div>
          ))}
          <div style={{ "--i": FIELDS.length } as CSSProperties} className="fill-in pt-3">
            <StatusBadge needsReview={false} notes={null} />
          </div>
        </dl>
        <figcaption className="mt-2 text-sm text-slate-500">The record InvoiceAI saves</figcaption>
      </figure>
    </div>
  );
}