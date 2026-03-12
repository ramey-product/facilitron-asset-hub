"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// ---- Types ----

export interface AssetTreeNode {
  assetId: number;
  equipmentName: string;
  equipmentBarCodeID: string | null;
  categoryName: string | null;
  conditionRating: number | null;
  lifecycleStatus: string;
  lastMaintenanceDate: string | null;
  children: AssetTreeNode[];
  depth: number;
}

export interface AssetRollup {
  assetId: number;
  equipmentName: string;
  totalDescendants: number;
  criticalCount: number;
  poorCount: number;
  totalMaintenanceCost: number;
  lastMaintenanceDate: string | null;
}

interface AssetTreeResponse {
  data: AssetTreeNode;
}

interface AssetRollupResponse {
  data: AssetRollup;
}

// ---- Hooks ----

export function useAssetTree(assetId: number) {
  return useQuery<AssetTreeResponse>({
    queryKey: ["hierarchies", "tree", assetId],
    queryFn: () => apiClient.hierarchies.getTree(assetId) as Promise<AssetTreeResponse>,
    enabled: assetId > 0,
  });
}

export function useAssetRollup(assetId: number) {
  return useQuery<AssetRollupResponse>({
    queryKey: ["hierarchies", "rollup", assetId],
    queryFn: () => apiClient.hierarchies.getRollup(assetId) as Promise<AssetRollupResponse>,
    enabled: assetId > 0,
  });
}

export function useReparentAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ assetId, parentId }: { assetId: number; parentId: number | null }) =>
      apiClient.hierarchies.reparent(assetId, { parentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hierarchies"] });
      queryClient.invalidateQueries({ queryKey: ["assets"] });
    },
  });
}
