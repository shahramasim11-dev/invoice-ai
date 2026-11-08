export interface Plan {
  name: string;
  price: string;
  period: string;
  summary: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

export const PLANS: Plan[] = [
  {
    name: "Free",
    price: "$0",
    period: "no time limit",
    summary: "For trying InvoiceAI on a few invoices.",
    features: ["20 invoices a month", "Dashboard and spending charts", "CSV export"],
    cta: "Try Free",
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    summary: "For freelancers and small shops.",
    features: [
      "500 invoices a month",
      "Excel export with line items",
      "Search in plain language",
      "Review flags and duplicate detection",
    ],
    cta: "Try Pro",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$49",
    period: "per month",
    summary: "For accounting teams with a steady volume.",
    features: [
      "Unlimited invoices",
      "Reports across currencies",
      "Shared workspace for your team",
      "Priority processing",
    ],
    cta: "Try Business",
  },
];