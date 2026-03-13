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
// All hooks accept optional propertyId to scope data to a single property.
// propertyId is included in query keys so scope changes trigger automatic re-fetches.

export function useDashboardStats(refetchInterval?: number, propertyId?: number | null) {
  const params: Record<string, string | number> = {};
  if (propertyId != null) params.propertyId = propertyId;

  return useQuery<DashboardStatsResponse>({
    queryKey: ["dashboard", "stats", { propertyId: propertyId ?? null }],
    queryFn: () =>
      apiClient.dashboard.stats(
        Object.keys(params).length > 0 ? params : undefined
      ) as Promise<DashboardStatsResponse>,
    staleTime: 30_000,
    refetchInterval: refetchInterval ?? false,
  });
}

export function useDashboardAlerts(
  type?: string,
  refetchInterval?: number,
  propertyId?: number | null
) {
  const params: Record<string, string | number> = {};
  if (type) params.type = type;
  if (propertyId != null) params.propertyId = propertyId;

  return useQuery<DashboardAlertsResponse>({
    queryKey: ["dashboard", "alerts", { type, propertyId: propertyId ?? null }],
    queryFn: () =>
      apiClient.dashboard.alerts(
        Object.keys(params).length > 0 ? params : undefined
      ) as Promise<DashboardAlertsResponse>,
    staleTime: 60_000,
    refetchInterval: refetchInterval ?? false,
  });
}

export function useDashboardActivity(
  page?: number,
  refetchInterval?: number,
  propertyId?: number | null
) {
  const params: Record<string, string | number> = {};
  if (page) params.page = page;
  if (propertyId != null) params.propertyId = propertyId;

  return useQuery<DashboardActivityResponse>({
    queryKey: ["dashboard", "activity", { page, propertyId: propertyId ?? null }],
    queryFn: () =>
      apiClient.dashboard.activity(
        Object.keys(params).length > 0 ? params : undefined
      ) as Promise<DashboardActivityResponse>,
    staleTime: 30_000,
    refetchInterval: refetchInterval ?? false,
  });
}
