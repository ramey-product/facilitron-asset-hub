"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

// ---- Types matching API response shapes ----

export interface AssetRecord {
  equipmentRecordID: number;
  customerID: number;
  propertyID: number | null;
  assetLocationID: number | null;
  equipmentName: string;
  equipmentDescription: string | null;
  equipmentTypeID: number | null;
  serialNumber: string | null;
  equipmentBarCodeID: string | null;
  manufacturerRecordID: number | null;
  modelNumber: string | null;
  acquisitionDate: string | null;
  acquisitionCost: number | null;
  warrantyExpiration: string | null;
  expectedLifeYears: number | null;
  lifecycleStatus: string;
  conditionRating: number | null;
  lastConditionDate: string | null;
  isActive: boolean;
  dateCreated: string;
  dateModified: string | null;
  createdBy: number | null;
  modifiedBy: number | null;
  notes: string | null;
  propertyName?: string;
  locationName?: string;
  categorySlug?: string;
  categoryName?: string;
  manufacturerName?: string;
  equipmentTypeName?: string;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

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
