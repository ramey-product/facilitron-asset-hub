"use client";

import Link from "next/link";
import { WifiOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useDashboardAlerts } from "@/hooks/use-dashboard";

export function OfflineAssetsList() {
  const { data, isLoading } = useDashboardAlerts();

  // Filter offline assets from alerts (would ideally be a dedicated endpoint)
  const offlineAlerts = data?.data ?? [];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Offline Assets</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded bg-[var(--muted)]" />
            ))}
          </div>
        )}

        {!isLoading && offlineAlerts.length === 0 && (
          <div className="py-6 text-center">
            <WifiOff className="mx-auto h-6 w-6 text-[var(--muted-foreground)]" />
            <p className="mt-2 text-xs text-[var(--muted-foreground)]">No offline assets</p>
          </div>
        )}

        {!isLoading && offlineAlerts.length > 0 && (
          <div className="space-y-1">
            {offlineAlerts.slice(0, 10).map((alert) => (
              <div
                key={alert.alertId}
                className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-[var(--muted)]/50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/assets/${alert.assetId}`}
                    className="text-sm font-medium text-[var(--foreground)] hover:text-[var(--primary)] hover:underline"
                  >
                    {alert.assetName}
                  </Link>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {alert.detail}
                  </p>
                </div>
                <Badge className="ml-2 shrink-0 border border-red-300 bg-red-100 text-[10px] text-red-900 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                  <WifiOff className="mr-1 h-2.5 w-2.5" />
                  Offline
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
