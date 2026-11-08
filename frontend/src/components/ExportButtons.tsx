import { apiClient } from "@/lib/api-client";
import type { SearchFilters } from "@/types/invoice";

interface ExportButtonsProps {
  filters: SearchFilters | null;
}

const BUTTON_STYLE =
  "rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50";

export default function ExportButtons({ filters }: ExportButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500">
        {filters ? "Export these results:" : "Export all:"}
      </span>
      <a href={apiClient.exportUrl("csv", filters)} className={BUTTON_STYLE}>
        CSV
      </a>
      <a href={apiClient.exportUrl("xlsx", filters)} className={BUTTON_STYLE}>
        Excel
      </a>
    </div>
  );
}