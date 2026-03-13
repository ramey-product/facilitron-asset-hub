"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  InventoryOverviewMetrics,
  InventoryHealthScore,
  AgeDistribution,
  StockHealthBreakdown,
  CrossModuleSearchResult,
  PaginationMeta,
} from "@asset-hub/shared";

interface OverviewMetricsResponse {
  data: InventoryOverviewMetrics & {
    ageDistribution: AgeDistribution[];
    stockHealth: StockHealthBreakdown;
  };
}

interface HealthScoreResponse {
  data: InventoryHealthScore;
}

interface SearchResponse {
  data: CrossModuleSearchResult[];
  meta: PaginationMeta;
}

export function useInventoryOverview() {
  return useQuery<OverviewMetricsResponse>({
    queryKey: ["inventory-overview", "metrics"],
    queryFn: () =>
      apiClient.inventoryOverview.getMetrics() as Promise<OverviewMetricsResponse>,
    staleTime: 2 * 60 * 1000,
  });
}

export function useHealthScore() {
  return useQuery<HealthScoreResponse>({
    queryKey: ["inventory-overview", "health-score"],
    queryFn: () =>
      apiClient.inventoryOverview.getHealthScore() as Promise<HealthScoreResponse>,
    staleTime: 2 * 60 * 1000,
  });
}

export function useInventorySearch(query: string, type?: string) {
  return useQuery<SearchResponse>({
    queryKey: ["inventory-search", query, type],
    queryFn: () =>
      apiClient.inventoryOverview.search({ q: query, type }) as Promise<SearchResponse>,
    enabled: !!query && query.length >= 2,
  });
}
