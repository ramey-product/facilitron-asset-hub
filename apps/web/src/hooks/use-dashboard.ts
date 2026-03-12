"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// ---- Types ----

export interface DashboardStats {
  totalAssets: number;
  activeCount: number;
  flaggedCount: number;
  criticalCount: number;
  poorCount: number;
  onlineCount: number;
  offlineCount: number;
  totalProperties: number;
  openWorkOrders: number;
  overdueWorkOrders: number;
  ytdMaintenanceCost: number;
  totalAssetValue: number;
  conditionDistribution: { name: string; value: number; fill: string }[];
  categoryBreakdown: { name: string; count: number; slug: string }[];
}

export interface DashboardAlert {
  alertId: string;
  assetId: number;
  assetName: string;
  assetTag: string | null;
  alertType: "overdue_maintenance" | "poor_condition" | "expired_warranty" | "expiring_warranty";
  severity: "critical" | "high" | "medium" | "low";
  detail: string;
  propertyName: string | null;
  categoryName: string | null;
}

export interface DashboardActivityEvent {
  eventId: string;
  assetId: number;
  assetName: string;
  eventType: string;
  description: string;
  userName: string;
  occurredAt: string;
}

interface DashboardStatsResponse {
  data: DashboardStats;
}

interface DashboardAlertsResponse {
  data: DashboardAlert[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

interface DashboardActivityResponse {
  data: DashboardActivityEvent[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

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
