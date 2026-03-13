"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { AssetTCO, TCOComparison, RepairVsReplaceRecord } from "@asset-hub/shared";

interface AssetTCOResponse { data: AssetTCO }
interface TCOComparisonResponse { data: TCOComparison }
interface RepairVsReplaceResponse { data: RepairVsReplaceRecord[] }

export function useAssetTCO(assetId: number) {
  return useQuery<AssetTCOResponse>({
    queryKey: ["asset-tco", assetId],
    queryFn: () => apiClient.tco.getByAsset(assetId) as Promise<AssetTCOResponse>,
    enabled: assetId > 0,
    staleTime: 10 * 60 * 1000,
  });
}

export function useTCOComparison(params?: Record<string, string | number>) {
  return useQuery<TCOComparisonResponse>({
    queryKey: ["tco-comparison", params],
    queryFn: () => apiClient.tco.comparison(params) as Promise<TCOComparisonResponse>,
    staleTime: 10 * 60 * 1000,
  });
}

export function useRepairVsReplace() {
  return useQuery<RepairVsReplaceResponse>({
    queryKey: ["repair-vs-replace"],
    queryFn: () => apiClient.tco.repairVsReplace() as Promise<RepairVsReplaceResponse>,
    staleTime: 10 * 60 * 1000,
  });
}
