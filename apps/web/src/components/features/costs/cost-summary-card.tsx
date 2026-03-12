"use client";

import Link from "next/link";
import { DollarSign, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { useAssetCosts } from "@/hooks/use-costs";

interface CostSummaryCardProps {
  assetId: number;
}

export function CostSummaryCard({ assetId }: CostSummaryCardProps) {
  const { data, isLoading } = useAssetCosts(assetId);
  const costs = data?.data;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-[var(--muted)]" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-2.5 w-16 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-5 w-20 animate-pulse rounded bg-[var(--muted)]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!costs) {
    return (
      <Card>
        <CardContent className="p-5 text-center">
          <DollarSign className="mx-auto h-6 w-6 text-[var(--muted-foreground)]" />
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">No cost data yet</p>
        </CardContent>
      </Card>
    );
  }

  const metrics = [
    { label: "Lifetime Total", value: formatCurrency(costs.lifetimeTotal) },
    { label: "Year to Date", value: formatCurrency(costs.ytdTotal) },
    { label: "Avg Per Work Order", value: formatCurrency(costs.avgPerWorkOrder) },
    { label: "Highest Work Order", value: formatCurrency(costs.highestWorkOrderCost) },
  ];

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">Cost Summary</h3>
          <Link
            href={`/assets/${assetId}#costs`}
            className="flex items-center gap-1 text-xs text-[var(--primary)] hover:underline"
          >
            View History
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {metrics.map((m) => (
            <div key={m.label}>
              <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
                {m.label}
              </div>
              <div className="mt-0.5 text-sm font-semibold text-[var(--foreground)]">
                {m.value}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--border)] pt-3 text-xs text-[var(--muted-foreground)]">
          {costs.totalWorkOrders} work order{costs.totalWorkOrders !== 1 ? "s" : ""} total
        </div>
      </CardContent>
    </Card>
  );
}
