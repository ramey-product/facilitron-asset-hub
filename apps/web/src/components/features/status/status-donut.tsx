"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import { resolveVar } from "@/lib/chart-theme";
import type { DashboardStats } from "@/hooks/use-dashboard";

interface StatusDonutProps {
  stats: DashboardStats;
}

export function OnlineOfflineDonut({ stats }: StatusDonutProps) {
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

  const data = [
    { name: "Online", value: stats.onlineCount, fill: "#10B981" },
    { name: "Offline", value: stats.offlineCount, fill: "#EF4444" },
  ].filter((d) => d.value > 0);

  const total = stats.onlineCount + stats.offlineCount;
  const onlinePct = total > 0 ? ((stats.onlineCount / total) * 100).toFixed(0) : "0";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Online / Offline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={44}
                outerRadius={68}
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
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-[var(--muted-foreground)]">Online</span>
            </div>
            <span className="font-medium text-[var(--foreground)]">
              {formatNumber(stats.onlineCount)} ({onlinePct}%)
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="text-[var(--muted-foreground)]">Offline</span>
            </div>
            <span className="font-medium text-[var(--foreground)]">
              {formatNumber(stats.offlineCount)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
