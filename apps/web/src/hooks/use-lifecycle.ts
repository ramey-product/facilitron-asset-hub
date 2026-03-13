"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  LifecycleEvent,
  LifecycleKPIs,
  LifecycleForecast,
  ComplianceRecord,
  CreateLifecycleEventInput,
} from "@asset-hub/shared";

interface LifecycleEventsResponse {
  data: LifecycleEvent[];
}

interface LifecycleKPIsResponse {
  data: LifecycleKPIs;
}

interface LifecycleForecastResponse {
  data: LifecycleForecast[];
}

interface ComplianceResponse {
  data: ComplianceRecord[];
}

export function useAssetLifecycle(assetId: number) {
  return useQuery<LifecycleEventsResponse>({
    queryKey: ["asset-lifecycle", assetId],
    queryFn: () =>
      apiClient.lifecycle.getAssetEvents(assetId) as Promise<LifecycleEventsResponse>,
    enabled: assetId > 0,
  });
}

export function useLifecycleKPIs() {
  return useQuery<LifecycleKPIsResponse>({
    queryKey: ["lifecycle-kpis"],
    queryFn: () =>
      apiClient.lifecycle.getKPIs() as Promise<LifecycleKPIsResponse>,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLifecycleForecast(years?: number) {
  return useQuery<LifecycleForecastResponse>({
    queryKey: ["lifecycle-forecast", years],
    queryFn: () =>
      apiClient.lifecycle.getForecast(years) as Promise<LifecycleForecastResponse>,
    staleTime: 10 * 60 * 1000,
  });
}

export function useLifecycleCompliance() {
  return useQuery<ComplianceResponse>({
    queryKey: ["lifecycle-compliance"],
    queryFn: () =>
      apiClient.lifecycle.getCompliance() as Promise<ComplianceResponse>,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateLifecycleEvent(assetId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateLifecycleEventInput) =>
      apiClient.lifecycle.createEvent(assetId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asset-lifecycle", assetId] });
      queryClient.invalidateQueries({ queryKey: ["lifecycle-kpis"] });
      queryClient.invalidateQueries({ queryKey: ["lifecycle-compliance"] });
    },
  });
}
