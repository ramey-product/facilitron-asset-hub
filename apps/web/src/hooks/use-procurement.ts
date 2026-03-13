"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  PurchaseOrder,
  PaginationMeta,
  SpendAnalytics,
  CreatePurchaseOrderInput,
  UpdatePurchaseOrderInput,
} from "@asset-hub/shared";

interface POListResponse {
  data: PurchaseOrder[];
  meta: PaginationMeta;
}

interface PODetailResponse {
  data: PurchaseOrder;
}

interface SpendAnalyticsResponse {
  data: SpendAnalytics;
}

export function usePurchaseOrders(params?: Record<string, string | number>) {
  return useQuery<POListResponse>({
    queryKey: ["purchase-orders", params],
    queryFn: () =>
      apiClient.procurement.orders.list(params) as Promise<POListResponse>,
  });
}

export function usePurchaseOrder(id: number) {
  return useQuery<PODetailResponse>({
    queryKey: ["purchase-orders", id],
    queryFn: () =>
      apiClient.procurement.orders.getById(id) as Promise<PODetailResponse>,
    enabled: id > 0,
  });
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePurchaseOrderInput) =>
      apiClient.procurement.orders.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
    },
  });
}

export function useUpdatePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePurchaseOrderInput }) =>
      apiClient.procurement.orders.update(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders", id] });
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
    },
  });
}

export function useSubmitPurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.procurement.orders.submit(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders", id] });
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
    },
  });
}

export function useApprovePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, approvedBy }: { id: number; approvedBy: number }) =>
      apiClient.procurement.orders.approve(id, approvedBy),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders", id] });
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
    },
  });
}

export function useCancelPurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.procurement.orders.cancel(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders", id] });
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
    },
  });
}

export function useMarkOrdered() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.procurement.orders.markOrdered(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["purchase-orders", id] });
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
    },
  });
}

export function useSpendAnalytics() {
  return useQuery<SpendAnalyticsResponse>({
    queryKey: ["spend-analytics"],
    queryFn: () =>
      apiClient.procurement.orders.analytics() as Promise<SpendAnalyticsResponse>,
    staleTime: 5 * 60 * 1000, // analytics are fairly stable
  });
}
