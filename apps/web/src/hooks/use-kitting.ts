"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  Kit,
  PaginationMeta,
  CreateKitInput,
  UpdateKitInput,
  KitCheckoutInput,
  KitCheckoutResult,
} from "@asset-hub/shared";

interface KitListResponse {
  data: Kit[];
  meta: PaginationMeta;
}

interface KitDetailResponse {
  data: Kit;
}

interface CheckoutResponse {
  data: KitCheckoutResult;
}

export function useKits(params?: Record<string, string | number>) {
  return useQuery<KitListResponse>({
    queryKey: ["kits", params],
    queryFn: () => apiClient.kitting.list(params) as Promise<KitListResponse>,
  });
}

export function useKit(id: number) {
  return useQuery<KitDetailResponse>({
    queryKey: ["kits", id],
    queryFn: () => apiClient.kitting.getById(id) as Promise<KitDetailResponse>,
    enabled: id > 0,
  });
}

export function useCreateKit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateKitInput) => apiClient.kitting.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kits"] });
    },
  });
}

export function useUpdateKit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateKitInput }) =>
      apiClient.kitting.update(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["kits", id] });
      queryClient.invalidateQueries({ queryKey: ["kits"] });
    },
  });
}

export function useDeleteKit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.kitting.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kits"] });
    },
  });
}

export function useCheckoutKit() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: KitCheckoutInput) =>
      apiClient.kitting.checkout(input) as Promise<CheckoutResponse>,
    onSuccess: () => {
      // Stock was decremented — invalidate relevant stock queries
      queryClient.invalidateQueries({ queryKey: ["stock"] });
    },
  });
}
