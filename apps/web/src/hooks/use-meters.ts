"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  AssetMeter,
  MeterReading,
  MeterThreshold,
  MeterAlert,
  CreateMeterReadingInput,
  UpdateMeterThresholdInput,
  PaginationMeta,
} from "@asset-hub/shared";

interface AssetMetersResponse { data: AssetMeter[] }
interface MeterHistoryResponse { data: MeterReading[]; meta: PaginationMeta }
interface MeterThresholdsResponse { data: MeterThreshold[] }
interface MeterAlertsResponse { data: MeterAlert[] }

export function useAssetMeters(assetId: number) {
  return useQuery<AssetMetersResponse>({
    queryKey: ["asset-meters", assetId],
    queryFn: () => apiClient.meters.getByAsset(assetId) as Promise<AssetMetersResponse>,
    enabled: assetId > 0,
  });
}

export function useMeterHistory(assetId: number, meterId: number, params?: Record<string, string | number>) {
  return useQuery<MeterHistoryResponse>({
    queryKey: ["meter-history", assetId, meterId, params],
    queryFn: () => apiClient.meters.history(assetId, meterId, params) as Promise<MeterHistoryResponse>,
    enabled: assetId > 0 && meterId > 0,
  });
}

export function useMeterThresholds(assetId: number, meterId: number) {
  return useQuery<MeterThresholdsResponse>({
    queryKey: ["meter-thresholds", assetId, meterId],
    queryFn: () => apiClient.meters.thresholds(assetId, meterId) as Promise<MeterThresholdsResponse>,
    enabled: assetId > 0 && meterId > 0,
  });
}

export function useMeterAlerts() {
  return useQuery<MeterAlertsResponse>({
    queryKey: ["meter-alerts"],
    queryFn: () => apiClient.meters.alerts() as Promise<MeterAlertsResponse>,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateReading(assetId: number, meterId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMeterReadingInput) =>
      apiClient.meters.createReading(assetId, meterId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asset-meters", assetId] });
      queryClient.invalidateQueries({ queryKey: ["meter-history", assetId, meterId] });
      queryClient.invalidateQueries({ queryKey: ["meter-alerts"] });
    },
  });
}

export function useUpdateThreshold(assetId: number, meterId: number, thresholdId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateMeterThresholdInput) =>
      apiClient.meters.updateThreshold(assetId, meterId, thresholdId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meter-thresholds", assetId, meterId] });
      queryClient.invalidateQueries({ queryKey: ["asset-meters", assetId] });
      queryClient.invalidateQueries({ queryKey: ["meter-alerts"] });
    },
  });
}
