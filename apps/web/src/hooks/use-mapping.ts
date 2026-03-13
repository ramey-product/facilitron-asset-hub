"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  FloorPlan,
  FloorPlanWithPins,
  AssetPin,
  PaginationMeta,
  CreateAssetPinInput,
  UpdateAssetPinInput,
} from "@asset-hub/shared";

interface FloorPlansResponse {
  data: FloorPlan[];
  meta: PaginationMeta;
}

interface FloorPlanResponse {
  data: FloorPlanWithPins;
}

interface PinsResponse {
  data: AssetPin[];
}

export function useFloorPlans(params?: Record<string, string | number>) {
  return useQuery<FloorPlansResponse>({
    queryKey: ["floor-plans", params],
    queryFn: () =>
      apiClient.mapping.listFloorPlans(params) as Promise<FloorPlansResponse>,
  });
}

export function useFloorPlan(mapId: number) {
  return useQuery<FloorPlanResponse>({
    queryKey: ["floor-plan", mapId],
    queryFn: () =>
      apiClient.mapping.getFloorPlan(mapId) as Promise<FloorPlanResponse>,
    enabled: mapId > 0,
  });
}

export function useAssetPins(mapId: number, params?: Record<string, string | number>) {
  return useQuery<PinsResponse>({
    queryKey: ["asset-pins", mapId, params],
    queryFn: () =>
      apiClient.mapping.getPins(mapId, params) as Promise<PinsResponse>,
    enabled: mapId > 0,
  });
}

export function useCreateAssetPin(mapId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateAssetPinInput) =>
      apiClient.mapping.createPin(mapId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floor-plan", mapId] });
      queryClient.invalidateQueries({ queryKey: ["asset-pins", mapId] });
    },
  });
}

export function useUpdateAssetPin(mapId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ pinId, data }: { pinId: number; data: UpdateAssetPinInput }) =>
      apiClient.mapping.updatePin(pinId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floor-plan", mapId] });
      queryClient.invalidateQueries({ queryKey: ["asset-pins", mapId] });
    },
  });
}

export function useDeleteAssetPin(mapId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pinId: number) => apiClient.mapping.deletePin(pinId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["floor-plan", mapId] });
      queryClient.invalidateQueries({ queryKey: ["asset-pins", mapId] });
    },
  });
}
