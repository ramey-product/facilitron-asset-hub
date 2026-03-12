"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// ---- Types matching API response shapes ----

export interface ConditionLogRecord {
  id: number;
  equipmentRecordId: number;
  customerId: number;
  conditionScore: number;
  previousScore: number | null;
  source: "manual" | "inspection" | "work_order";
  notes: string | null;
  loggedBy: number;
  loggedAt: string;
}

export interface ConditionScaleRecord {
  conditionID: number;
  customerID: number;
  conditionName: string;
  conditionScore: number;
  colorCode: string;
  description: string;
  isActive: boolean;
}

export interface ConditionStats {
  currentScore: number;
  currentLabel: string;
  previousScore: number | null;
  trend: "improving" | "declining" | "stable";
  totalLogs: number;
  lastLoggedAt: string;
  averageScore: number;
  scoreHistory: { date: string; score: number }[];
}

interface ConditionHistoryResponse {
  data: ConditionLogRecord[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

interface ConditionStatsResponse {
  data: ConditionStats;
}

interface ConditionScaleResponse {
  data: ConditionScaleRecord[];
}

// ---- Hooks ----

export function useConditionScale() {
  return useQuery<ConditionScaleResponse>({
    queryKey: ["conditions", "scale"],
    queryFn: () => apiClient.conditions.getScale() as Promise<ConditionScaleResponse>,
    staleTime: 5 * 60 * 1000, // Scale rarely changes
  });
}

export function useConditionHistory(
  assetId: number,
  params?: { limit?: number; offset?: number }
) {
  return useQuery<ConditionHistoryResponse>({
    queryKey: ["conditions", "history", assetId, params],
    queryFn: () =>
      apiClient.conditions.getHistory(
        assetId,
        params as Record<string, string | number>
      ) as Promise<ConditionHistoryResponse>,
    enabled: assetId > 0,
  });
}

export function useConditionStats(assetId: number) {
  return useQuery<ConditionStatsResponse>({
    queryKey: ["conditions", "stats", assetId],
    queryFn: () =>
      apiClient.conditions.getStats(assetId) as Promise<ConditionStatsResponse>,
    enabled: assetId > 0,
  });
}

export function useLogCondition() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      assetId,
      data,
    }: {
      assetId: number;
      data: { conditionScore: number; source?: string; notes?: string };
    }) => apiClient.conditions.log(assetId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["conditions", "history", variables.assetId],
      });
      queryClient.invalidateQueries({
        queryKey: ["conditions", "stats", variables.assetId],
      });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}
