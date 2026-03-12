"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber } from "@/lib/utils";
import type { DashboardStats } from "@/hooks/use-dashboard";

interface CategoryBreakdownProps {
  stats: DashboardStats;
}

export function CategoryBreakdown({ stats }: CategoryBreakdownProps) {
  const categories = stats.categoryBreakdown.slice(0, 5);
  const max = categories[0]?.count ?? 1;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Top Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.slug}>
              <div className="mb-1 flex items-center justify-between">
                <span className="max-w-[180px] truncate text-xs text-[var(--foreground)]">
                  {cat.name}
                </span>
                <span className="ml-2 text-xs font-semibold text-[var(--foreground)]">
                  {formatNumber(cat.count)}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[var(--muted)]">
                <div
                  className="h-1.5 rounded-full bg-[var(--primary)] transition-all"
                  style={{ width: `${(cat.count / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-center text-xs text-[var(--muted-foreground)]">
              No category data available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
