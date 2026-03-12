"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// ---- Types ----

export interface AssetCostSummary {
  assetId: number;
  lifetimeTotal: number;
  ytdTotal: number;
  avgPerWorkOrder: number;
  highestWorkOrderCost: number;
  highestWorkOrderId: string | null;
  totalWorkOrders: number;
}

export interface CostHistoryPoint {
  month: string; // "2024-01"
  monthLabel: string; // "Jan 2024"
  laborCost: number;
  partsCost: number;
  vendorCost: number;
  totalCost: number;
  cumulativeTotal: number;
}

export interface TopCostAsset {
  assetId: number;
  equipmentName: string;
  propertyName: string | null;
  categoryName: string | null;
  lifetimeTotal: number;
  ytdTotal: number;
}

interface AssetCostSummaryResponse {
  data: AssetCostSummary;
}

interface CostHistoryResponse {
  data: CostHistoryPoint[];
}

interface TopCostAssetsResponse {
  data: TopCostAsset[];
}

// ---- Hooks ----

export function useAssetCosts(assetId: number) {
  return useQuery<AssetCostSummaryResponse>({
    queryKey: ["costs", "summary", assetId],
    queryFn: () => apiClient.costs.getSummary(assetId) as Promise<AssetCostSummaryResponse>,
    enabled: assetId > 0,
    staleTime: 60_000,
  });
}

export function useAssetCostHistory(assetId: number) {
  return useQuery<CostHistoryResponse>({
    queryKey: ["costs", "history", assetId],
    queryFn: () => apiClient.costs.getHistory(assetId) as Promise<CostHistoryResponse>,
    enabled: assetId > 0,
    staleTime: 60_000,
  });
}

export function useTopCostAssets(limit?: number) {
  return useQuery<TopCostAssetsResponse>({
    queryKey: ["costs", "top", limit],
    queryFn: () =>
      apiClient.costs.getTopCost(limit ? { limit } : undefined) as Promise<TopCostAssetsResponse>,
    staleTime: 60_000,
  });
}
