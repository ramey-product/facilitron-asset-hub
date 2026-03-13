"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  ReceivingRecord,
  PaginationMeta,
  CreateReceivingInput,
} from "@asset-hub/shared";

interface ReceivingListResponse {
  data: ReceivingRecord[];
  meta: PaginationMeta;
}

interface ReceivingDetailResponse {
  data: ReceivingRecord;
}

interface DiscrepanciesResponse {
  data: ReceivingRecord[];
}

export function useReceivingRecords(params?: Record<string, string | number>) {
  return useQuery<ReceivingListResponse>({
    queryKey: ["receiving-records", params],
    queryFn: () =>
      apiClient.procurement.receiving.list(params) as Promise<ReceivingListResponse>,
  });
}

export function useReceivingRecord(id: number) {
  return useQuery<ReceivingDetailResponse>({
    queryKey: ["receiving-records", id],
    queryFn: () =>
      apiClient.procurement.receiving.getById(id) as Promise<ReceivingDetailResponse>,
    enabled: id > 0,
  });
}

export function useCreateReceivingRecord() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReceivingInput) =>
      apiClient.procurement.receiving.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receiving-records"] });
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
    },
  });
}

export function useDiscrepancies() {
  return useQuery<DiscrepanciesResponse>({
    queryKey: ["receiving-discrepancies"],
    queryFn: () =>
      apiClient.procurement.receiving.discrepancies() as Promise<DiscrepanciesResponse>,
  });
}
