"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  AssetDepreciation,
  DepreciationScheduleRow,
  FixedAssetRegisterRow,
  DepreciationSummary,
} from "@asset-hub/shared";

interface AssetDepreciationResponse { data: AssetDepreciation }
interface DepreciationScheduleResponse { data: DepreciationScheduleRow[] }
interface FixedAssetRegisterResponse { data: FixedAssetRegisterRow[] }
interface DepreciationSummaryResponse { data: DepreciationSummary }

export function useAssetDepreciation(assetId: number) {
  return useQuery<AssetDepreciationResponse>({
    queryKey: ["asset-depreciation", assetId],
    queryFn: () => apiClient.depreciation.getByAsset(assetId) as Promise<AssetDepreciationResponse>,
    enabled: assetId > 0,
    staleTime: 10 * 60 * 1000,
  });
}

export function useDepreciationSchedule(assetId: number) {
  return useQuery<DepreciationScheduleResponse>({
    queryKey: ["depreciation-schedule", assetId],
    queryFn: () => apiClient.depreciation.schedule(assetId) as Promise<DepreciationScheduleResponse>,
    enabled: assetId > 0,
    staleTime: 10 * 60 * 1000,
  });
}

export function useFixedAssetRegister() {
  return useQuery<FixedAssetRegisterResponse>({
    queryKey: ["fixed-asset-register"],
    queryFn: () => apiClient.depreciation.register() as Promise<FixedAssetRegisterResponse>,
    staleTime: 10 * 60 * 1000,
  });
}

export function useDepreciationSummary() {
  return useQuery<DepreciationSummaryResponse>({
    queryKey: ["depreciation-summary"],
    queryFn: () => apiClient.depreciation.summary() as Promise<DepreciationSummaryResponse>,
    staleTime: 10 * 60 * 1000,
  });
}
