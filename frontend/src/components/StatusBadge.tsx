interface StatusBadgeProps {
  needsReview: boolean;
  notes: string | null;
}

export default function StatusBadge({ needsReview, notes }: StatusBadgeProps) {
  if (!needsReview) {
    return (
      <span className="inline-flex rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
        Checks passed
      </span>
    );
  }
  return (
    <span
      title={notes ?? undefined}
      className="inline-flex cursor-help rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800"
    >
      Needs review
    </span>
  );
}