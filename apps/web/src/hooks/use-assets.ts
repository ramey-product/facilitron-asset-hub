"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { AssetRecord, PaginationMeta } from "@asset-hub/shared";

export type { AssetRecord };

interface AssetListResponse {
  data: AssetRecord[];
  meta: PaginationMeta;
}

interface AssetDetailResponse {
  data: AssetRecord;
}

// ---- Helpers ----

export function conditionLabel(rating: number | null): string {
  if (rating === null) return "Unknown";
  const map: Record<number, string> = {
    5: "Excellent",
    4: "Good",
    3: "Fair",
    2: "Poor",
    1: "Critical",
  };
  return map[rating] ?? "Unknown";
}

export function lifecycleLabel(status: string): string {
  const map: Record<string, string> = {
    Active: "Active",
    UnderMaintenance: "Under Maintenance",
    Flagged: "Flagged for Replacement",
    Decommissioned: "Decommissioned",
    Procurement: "Procurement",
  };
  return map[status] ?? status;
}

// ---- Hooks ----

export function useAssets(params?: Record<string, string | number>) {
  return useQuery<AssetListResponse>({
    queryKey: ["assets", params],
    queryFn: () => apiClient.assets.list(params) as Promise<AssetListResponse>,
  });
}

export function useAsset(id: number) {
  return useQuery<AssetDetailResponse>({
    queryKey: ["assets", id],
    queryFn: () => apiClient.assets.getById(id) as Promise<AssetDetailResponse>,
    enabled: id > 0,
  });
}

export function useCreateAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiClient.assets.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}

export function useUpdateAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      apiClient.assets.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.assets.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}
