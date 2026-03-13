"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  DashboardStats,
  DashboardAlert,
  ActivityEvent,
} from "@asset-hub/shared";
import type { PaginationMeta } from "@asset-hub/shared";

// ---- Response envelopes ----

interface DashboardStatsResponse {
  data: DashboardStats;
}

interface DashboardAlertsResponse {
  data: DashboardAlert[];
  meta: PaginationMeta;
}

interface DashboardActivityResponse {
  data: ActivityEvent[];
  meta: PaginationMeta;
}

// Re-export types for component convenience
export type { DashboardStats, DashboardAlert, ActivityEvent };

// ---- Hooks ----

export function useDashboardStats(refetchInterval?: number) {
  return useQuery<DashboardStatsResponse>({
    queryKey: ["dashboard", "stats"],
    queryFn: () => apiClient.dashboard.stats() as Promise<DashboardStatsResponse>,
    staleTime: 30_000,
    refetchInterval: refetchInterval ?? false,
  });
}

export function useDashboardAlerts(
  type?: string,
  refetchInterval?: number
) {
  return useQuery<DashboardAlertsResponse>({
    queryKey: ["dashboard", "alerts", type],
    queryFn: () =>
      apiClient.dashboard.alerts(
        type ? { type } : undefined
      ) as Promise<DashboardAlertsResponse>,
    staleTime: 60_000,
    refetchInterval: refetchInterval ?? false,
  });
}

export function useDashboardActivity(page?: number, refetchInterval?: number) {
  return useQuery<DashboardActivityResponse>({
    queryKey: ["dashboard", "activity", page],
    queryFn: () =>
      apiClient.dashboard.activity(
        page ? { page } : undefined
      ) as Promise<DashboardActivityResponse>,
    staleTime: 30_000,
    refetchInterval: refetchInterval ?? false,
  });
}
