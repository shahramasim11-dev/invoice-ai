export function formatMoney(
  value: string | number | null,
  currency = "USD"
): string {
  if (value === null || value === "") return "—";
  const amount = Number(value);
  if (Number.isNaN(amount)) return "—";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    // Intl throws on a currency code it doesn't recognise
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export function formatDate(value: string | null): string {
  if (!value) return "—";
  // Build the date from its parts. new Date("2026-10-09") is read as UTC
  // midnight and can display as the previous day in some timezones.
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}