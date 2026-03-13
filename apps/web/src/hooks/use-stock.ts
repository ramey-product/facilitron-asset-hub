"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  StockLevel,
  StockRollup,
  StockAlert,
  StockAdjustInput,
  PaginationMeta,
} from "@asset-hub/shared";

interface StockLevelsResponse {
  data: StockLevel[];
}

interface StockRollupResponse {
  data: StockRollup[];
  meta: PaginationMeta;
}

interface StockAlertsResponse {
  data: StockAlert[];
}

export function useStockLevels(partId: number) {
  return useQuery<StockLevelsResponse>({
    queryKey: ["stock", partId],
    queryFn: () => apiClient.stock.getByPart(partId) as Promise<StockLevelsResponse>,
    enabled: partId > 0,
  });
}

export function useStockRollup(params?: Record<string, string | number>) {
  return useQuery<StockRollupResponse>({
    queryKey: ["stock-rollup", params],
    queryFn: () => apiClient.stock.rollup(params) as Promise<StockRollupResponse>,
  });
}

export function useStockAlerts(params?: Record<string, string | number>) {
  return useQuery<StockAlertsResponse>({
    queryKey: ["stock-alerts", params],
    queryFn: () => apiClient.stock.alerts(params) as Promise<StockAlertsResponse>,
    refetchInterval: 60_000, // refresh alerts every minute
  });
}

export function useAdjustStock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      partId,
      locationId,
      data,
    }: {
      partId: number;
      locationId: number;
      data: StockAdjustInput;
    }) => apiClient.stock.adjust(partId, locationId, data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["stock", variables.partId] });
      queryClient.invalidateQueries({ queryKey: ["stock-rollup"] });
      queryClient.invalidateQueries({ queryKey: ["stock-alerts"] });
      queryClient.invalidateQueries({ queryKey: ["audit-inventory"] });
    },
  });
}
