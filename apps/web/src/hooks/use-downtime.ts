"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  DowntimeEvent,
  DowntimeStats,
  ReliabilityRecord,
  CreateDowntimeEventInput,
  PaginationMeta,
} from "@asset-hub/shared";

interface DowntimeEventsResponse { data: DowntimeEvent[]; meta: PaginationMeta }
interface DowntimeStatsResponse { data: DowntimeStats }
interface ReliabilityResponse { data: ReliabilityRecord[] }

export function useDowntimeEvents(assetId: number, params?: Record<string, string | number>) {
  return useQuery<DowntimeEventsResponse>({
    queryKey: ["downtime-events", assetId, params],
    queryFn: () => apiClient.downtime.events(assetId, params) as Promise<DowntimeEventsResponse>,
    enabled: assetId > 0,
  });
}

export function useDowntimeStats(assetId: number, window: "90d" | "6m" | "12m" = "90d") {
  return useQuery<DowntimeStatsResponse>({
    queryKey: ["downtime-stats", assetId, window],
    queryFn: () => apiClient.downtime.stats(assetId, { window }) as Promise<DowntimeStatsResponse>,
    enabled: assetId > 0,
  });
}

export function useReliabilityOverview() {
  return useQuery<ReliabilityResponse>({
    queryKey: ["reliability-overview"],
    queryFn: () => apiClient.downtime.reliability() as Promise<ReliabilityResponse>,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateDowntimeEvent(assetId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDowntimeEventInput) =>
      apiClient.downtime.createEvent(assetId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["downtime-events", assetId] });
      queryClient.invalidateQueries({ queryKey: ["downtime-stats", assetId] });
      queryClient.invalidateQueries({ queryKey: ["reliability-overview"] });
    },
  });
}

export function useResolveDowntimeEvent(assetId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (eventId: number) => apiClient.downtime.resolve(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["downtime-events", assetId] });
      queryClient.invalidateQueries({ queryKey: ["downtime-stats", assetId] });
      queryClient.invalidateQueries({ queryKey: ["reliability-overview"] });
    },
  });
}
