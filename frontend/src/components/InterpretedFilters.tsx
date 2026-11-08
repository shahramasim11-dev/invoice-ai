import type { SearchFilters } from "@/types/invoice";

interface InterpretedFiltersProps {
  query: string;
  filters: SearchFilters;
  count: number;
}

function describe(f: SearchFilters): string[] {
  const chips: string[] = [];
  if (f.vendor) chips.push(`Vendor contains "${f.vendor}"`);
  if (f.min_total) chips.push(`Total at least ${f.min_total}`);
  if (f.max_total) chips.push(`Total at most ${f.max_total}`);
  if (f.date_from) chips.push(`From ${f.date_from}`);
  if (f.date_to) chips.push(`Until ${f.date_to}`);
  if (f.currency) chips.push(`Currency ${f.currency}`);
  if (f.needs_review !== null) {
    chips.push(f.needs_review ? "Needs review only" : "Checks passed only");
  }
  return chips;
}

export default function InterpretedFilters({ query, filters, count }: InterpretedFiltersProps) {
  const chips = describe(filters);
  return (
    <div className="rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-900">
      <p>
        <span className="font-medium">
          {count} result{count === 1 ? "" : "s"}
        </span>{" "}
        for “{query}”
      </p>
      <p className="mt-1.5 flex flex-wrap items-center gap-2">
        <span className="text-blue-700">AI understood:</span>
        {chips.length === 0 ? (
          <span>no filters, so showing everything</span>
        ) : (
          chips.map((chip) => (
            <span key={chip} className="rounded-full bg-white px-2.5 py-0.5 text-xs font-medium">
              {chip}
            </span>
          ))
        )}
      </p>
    </div>
  );
}