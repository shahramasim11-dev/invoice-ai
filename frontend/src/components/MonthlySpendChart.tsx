"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthSpend } from "@/lib/analytics";
import { formatMoney } from "@/lib/format";

interface MonthlySpendChartProps {
  data: MonthSpend[];
  currency: string;
}

export default function MonthlySpendChart({ data, currency }: MonthlySpendChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 8, right: 16 }}>
          <CartesianGrid vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
          <YAxis
            width={80}
            tickFormatter={(value: number) => formatMoney(value, currency)}
            stroke="#64748b"
            fontSize={12}
          />
          <Tooltip
            formatter={(value) => formatMoney(Number(value), currency)}
            cursor={{ fill: "#f1f5f9" }}
          />
          <Bar dataKey="total" name="Spend" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={72} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}