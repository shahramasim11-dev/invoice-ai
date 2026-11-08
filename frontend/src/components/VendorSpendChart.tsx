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
import type { VendorSpend } from "@/lib/analytics";
import { formatMoney } from "@/lib/format";

interface VendorSpendChartProps {
  data: VendorSpend[];
  currency: string;
}

const shorten = (name: string) => (name.length > 16 ? `${name.slice(0, 15)}…` : name);

export default function VendorSpendChart({ data, currency }: VendorSpendChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
          <CartesianGrid horizontal={false} stroke="#e2e8f0" />
          <XAxis
            type="number"
            tickFormatter={(value: number) => formatMoney(value, currency)}
            stroke="#64748b"
            fontSize={12}
          />
          <YAxis
            type="category"
            dataKey="vendor"
            width={120}
            tickFormatter={shorten}
            stroke="#64748b"
            fontSize={12}
          />
          <Tooltip
            formatter={(value) => formatMoney(Number(value), currency)}
            cursor={{ fill: "#f1f5f9" }}
          />
          <Bar dataKey="total" name="Spend" fill="#2563eb" radius={[0, 4, 4, 0]} maxBarSize={36} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}