"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// ---- Types ----

export interface AssetStatus {
  assetId: number;
  isOnline: boolean;
  reasonCode: string | null;
  reasonLabel: string | null;
  notes: string | null;
  updatedAt: string;
  updatedBy: string | null;
}

export interface StatusReason {
  code: string;
  label: string;
  requiresNotes: boolean;
}

interface AssetStatusResponse {
  data: AssetStatus;
}

interface StatusReasonsResponse {
  data: StatusReason[];
}

// ---- Hooks ----

export function useAssetStatus(assetId: number) {
  return useQuery<AssetStatusResponse>({
    queryKey: ["status", assetId],
    queryFn: () => apiClient.status.get(assetId) as Promise<AssetStatusResponse>,
    enabled: assetId > 0,
    staleTime: 30_000,
  });
}

export function useStatusReasons() {
  return useQuery<StatusReasonsResponse>({
    queryKey: ["status", "reasons"],
    queryFn: () => apiClient.status.reasons() as Promise<StatusReasonsResponse>,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      assetId,
      isOnline,
      reasonCode,
      notes,
    }: {
      assetId: number;
      isOnline: boolean;
      reasonCode?: string;
      notes?: string;
    }) => apiClient.status.update(assetId, { isOnline, reasonCode, notes }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["status", variables.assetId] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}
