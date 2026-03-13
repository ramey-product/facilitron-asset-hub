"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  ReorderAlert,
  ReorderRule,
  PaginationMeta,
  CreateReorderRuleInput,
  UpdateReorderRuleInput,
} from "@asset-hub/shared";

interface AlertListResponse {
  data: ReorderAlert[];
  meta: PaginationMeta;
}

interface AlertDetailResponse {
  data: ReorderAlert;
}

interface RuleListResponse {
  data: ReorderRule[];
}

interface RuleDetailResponse {
  data: ReorderRule;
}

// ---- Alert queries ----

export function useReorderAlerts(params?: Record<string, string | number>) {
  return useQuery<AlertListResponse>({
    queryKey: ["reorder-alerts", params],
    queryFn: () => apiClient.alerts.list(params) as Promise<AlertListResponse>,
  });
}

export function useDismissAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.alerts.dismiss(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reorder-alerts"] });
    },
  });
}

export function useConvertAlertToPO() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.alerts.convertToPO(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reorder-alerts"] });
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
    },
  });
}

// ---- Reorder Rule queries ----

export function useReorderRules() {
  return useQuery<RuleListResponse>({
    queryKey: ["reorder-rules"],
    queryFn: () => apiClient.alerts.rules.list() as Promise<RuleListResponse>,
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateReorderRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReorderRuleInput) => apiClient.alerts.rules.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reorder-rules"] });
      queryClient.invalidateQueries({ queryKey: ["reorder-alerts"] });
    },
  });
}

export function useUpdateReorderRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateReorderRuleInput }) =>
      apiClient.alerts.rules.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reorder-rules"] });
      queryClient.invalidateQueries({ queryKey: ["reorder-alerts"] });
    },
  });
}

export function useDeleteReorderRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.alerts.rules.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reorder-rules"] });
    },
  });
}
