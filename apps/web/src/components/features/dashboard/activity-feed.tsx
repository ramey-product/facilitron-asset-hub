"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardActivity } from "@/hooks/use-dashboard";

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface ActivityFeedProps {
  refetchInterval?: number;
  propertyId?: number | null;
}

export function ActivityFeed({ refetchInterval, propertyId }: ActivityFeedProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useDashboardActivity(page, refetchInterval, propertyId);

  const events = data?.data ?? [];
  const hasMore = data ? page < data.meta.totalPages : false;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-7 w-7 animate-pulse rounded-full bg-[var(--muted)]" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 w-3/4 animate-pulse rounded bg-[var(--muted)]" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--muted)]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && events.length === 0 && (
          <div className="py-8 text-center">
            <Activity className="mx-auto h-7 w-7 text-[var(--muted-foreground)]" />
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">No recent activity</p>
          </div>
        )}

        {!isLoading && events.length > 0 && (
          <>
            <div className="space-y-0.5">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-[var(--muted)]/50"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--primary)]/10">
                    <Activity className="h-3.5 w-3.5 text-[var(--primary)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-[var(--foreground)]">
                        {event.actor}
                      </span>
                      <span className="text-xs text-[var(--muted-foreground)]">
                        {event.description}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2">
                      <span className="truncate text-xs text-[var(--muted-foreground)]">
                        {event.assetName}
                      </span>
                      <span className="shrink-0 text-[10px] text-[var(--muted-foreground)]">
                        {timeAgo(event.timestamp)}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/assets/${event.assetId}`}
                    aria-label={`View ${event.assetName}`}
                    className="shrink-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="mt-2 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-[var(--muted-foreground)]"
                  onClick={() => setPage((p) => p + 1)}
                >
                  Load More
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
