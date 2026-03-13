"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  InventoryTransfer,
  PaginationMeta,
  CreateTransferInput,
} from "@asset-hub/shared";

interface TransferListResponse {
  data: InventoryTransfer[];
  meta: PaginationMeta;
}

interface TransferDetailResponse {
  data: InventoryTransfer;
}

export function useTransfers(params?: Record<string, string | number>) {
  return useQuery<TransferListResponse>({
    queryKey: ["transfers", params],
    queryFn: () => apiClient.transfers.list(params) as Promise<TransferListResponse>,
  });
}

export function useTransfer(id: number) {
  return useQuery<TransferDetailResponse>({
    queryKey: ["transfers", id],
    queryFn: () => apiClient.transfers.getById(id) as Promise<TransferDetailResponse>,
    enabled: id > 0,
  });
}

export function useCreateTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTransferInput) => apiClient.transfers.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
}

export function useApproveTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.transfers.approve(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["transfers", id] });
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
}

export function useShipTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.transfers.ship(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["transfers", id] });
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
    },
  });
}

export function useReceiveTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.transfers.receive(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["transfers", id] });
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
    },
  });
}

export function useCancelTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.transfers.cancel(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["transfers", id] });
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
    },
  });
}
