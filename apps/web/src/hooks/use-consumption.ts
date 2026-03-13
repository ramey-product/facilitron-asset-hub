"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  ConsumptionRecord,
  ConsumptionForecast,
  InventoryAuditRecord,
  PaginationMeta,
} from "@asset-hub/shared";

interface ConsumptionListResponse {
  data: ConsumptionRecord[];
  meta: PaginationMeta;
}

interface ConsumptionForecastResponse {
  data: ConsumptionForecast;
}

interface AuditTrailResponse {
  data: InventoryAuditRecord[];
  meta: PaginationMeta;
}

export function useConsumption(params?: Record<string, string | number>) {
  return useQuery<ConsumptionListResponse>({
    queryKey: ["consumption", params],
    queryFn: () => apiClient.consumption.list(params) as Promise<ConsumptionListResponse>,
  });
}

export function useConsumptionForecast(partId: number) {
  return useQuery<ConsumptionForecastResponse>({
    queryKey: ["consumption-forecast", partId],
    queryFn: () => apiClient.consumption.forecast(partId) as Promise<ConsumptionForecastResponse>,
    enabled: partId > 0,
  });
}

export function useAuditTrail(params?: Record<string, string | number>) {
  return useQuery<AuditTrailResponse>({
    queryKey: ["audit-inventory", params],
    queryFn: () => apiClient.audit.inventory(params) as Promise<AuditTrailResponse>,
  });
}
