import Link from "next/link";
import { PLANS } from "@/lib/plans";

export default function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-4 border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold tracking-tight">Pricing</h2>
        <p className="mt-2 max-w-xl text-slate-600">
          InvoiceAI is a portfolio project, so there&apos;s no billing. Every plan opens the same
          demo dashboard.
        </p>

        <div className="mt-8 grid divide-y divide-slate-300 border border-slate-300 bg-white md:grid-cols-3 md:divide-x md:divide-y-0">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col p-6 ${
                plan.highlighted ? "bg-slate-50 shadow-[inset_0_2px_0_0_#2563eb]" : ""
              }`}
            >
              <h3 className="font-medium">{plan.name}</h3>
              <p className="mt-3 text-3xl font-semibold tabular-nums">
                {plan.price}
                <span className="ml-1.5 text-sm font-normal text-slate-500">{plan.period}</span>
              </p>
              <p className="mt-2 text-sm text-slate-600">{plan.summary}</p>
              <Link
                href="/dashboard"
                className={`mt-5 rounded-md px-4 py-2.5 text-center text-sm font-medium ${
                  plan.highlighted
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "border border-slate-300 bg-white hover:bg-slate-50"
                }`}
              >
                {plan.cta}
              </Link>
              <ul className="mt-6 divide-y divide-slate-100 border-t border-slate-100 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="py-2.5">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}