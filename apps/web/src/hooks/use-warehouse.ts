"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useTransactions(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["warehouse-transactions", params],
    queryFn: () => apiClient.warehouse.list(params),
  });
}

export function useWarehouseStats() {
  return useQuery({
    queryKey: ["warehouse-stats"],
    queryFn: () => apiClient.warehouse.getStats(),
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => apiClient.warehouse.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["warehouse-stats"] });
    },
  });
}
