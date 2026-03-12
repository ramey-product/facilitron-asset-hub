"use client";

import { useState, useEffect } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveVar } from "@/lib/chart-theme";
import { useAssetCostHistory } from "@/hooks/use-costs";

interface CostHistoryChartProps {
  assetId: number;
}

const COST_COLORS = {
  labor: "#DC2626",
  parts: "#3B82F6",
  vendor: "#10B981",
  cumulative: "#6B7280",
};

export function CostHistoryChart({ assetId }: CostHistoryChartProps) {
  const { data, isLoading } = useAssetCostHistory(assetId);
  const [axisColors, setAxisColors] = useState({ border: "#e2e4e9", muted: "#64748b", card: "#ffffff", foreground: "#1a1a2e" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAxisColors({
        border: resolveVar("--border"),
        muted: resolveVar("--muted-foreground"),
        card: resolveVar("--card"),
        foreground: resolveVar("--foreground"),
      });
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  const tooltipStyle: React.CSSProperties = {
    backgroundColor: axisColors.card,
    border: `1px solid ${axisColors.border}`,
    borderRadius: "8px",
    color: axisColors.foreground,
    fontSize: "12px",
  };

  const points = data?.data ?? [];

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Cost History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] animate-pulse rounded bg-[var(--muted)]" />
        </CardContent>
      </Card>
    );
  }

  if (points.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Cost History</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-sm text-[var(--muted-foreground)]">No cost history available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">Cost History</CardTitle>
          <span className="text-xs text-[var(--muted-foreground)]">Last 12 months</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={points}>
              <CartesianGrid strokeDasharray="3 3" stroke={axisColors.border} />
              <XAxis
                dataKey="monthLabel"
                tick={{ fill: axisColors.muted, fontSize: 11 }}
                axisLine={{ stroke: axisColors.border }}
                tickLine={false}
              />
              <YAxis
                yAxisId="left"
                tick={{ fill: axisColors.muted, fontSize: 11 }}
                axisLine={{ stroke: axisColors.border }}
                tickLine={false}
                tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fill: axisColors.muted, fontSize: 11 }}
                axisLine={{ stroke: axisColors.border }}
                tickLine={false}
                tickFormatter={(v) => `$${Math.round(v / 1000)}k`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value: unknown, name: unknown) => {
                  const labels: Record<string, string> = {
                    laborCost: "Labor",
                    partsCost: "Parts",
                    vendorCost: "Vendor",
                    cumulativeTotal: "Cumulative",
                  };
                  const nameStr = String(name ?? "");
                  return [`$${Number(value).toLocaleString()}`, labels[nameStr] ?? nameStr];
                }}
              />
              <Legend
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    laborCost: "Labor",
                    partsCost: "Parts",
                    vendorCost: "Vendor",
                    cumulativeTotal: "Cumulative",
                  };
                  return labels[value] ?? value;
                }}
                wrapperStyle={{ fontSize: "11px" }}
              />
              <Bar
                yAxisId="left"
                dataKey="laborCost"
                stackId="costs"
                fill={COST_COLORS.labor}
                name="laborCost"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="partsCost"
                stackId="costs"
                fill={COST_COLORS.parts}
                name="partsCost"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="vendorCost"
                stackId="costs"
                fill={COST_COLORS.vendor}
                name="vendorCost"
                radius={[4, 4, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cumulativeTotal"
                stroke={COST_COLORS.cumulative}
                strokeWidth={2}
                dot={false}
                name="cumulativeTotal"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
