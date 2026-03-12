"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { resolveVar } from "@/lib/chart-theme";
import type { DashboardStats } from "@/hooks/use-dashboard";

interface StatusDonutChartProps {
  stats: DashboardStats;
}

export function StatusDonutChart({ stats }: StatusDonutChartProps) {
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    setTooltipStyle({
      backgroundColor: resolveVar("--card"),
      border: `1px solid ${resolveVar("--border")}`,
      borderRadius: "8px",
      color: resolveVar("--foreground"),
      fontSize: "12px",
    });
  }, []);

  const data = stats.conditionDistribution;
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Asset Condition</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={48}
                outerRadius={76}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 space-y-1.5">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-[var(--muted-foreground)]">{item.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-[var(--foreground)]">
                  {formatNumber(item.value)}
                </span>
                {total > 0 && (
                  <span className="text-[var(--muted-foreground)]">
                    ({((item.value / total) * 100).toFixed(0)}%)
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
