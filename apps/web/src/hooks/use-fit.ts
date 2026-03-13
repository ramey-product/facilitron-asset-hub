"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { FitSummary, FitInspectionRecord } from "@asset-hub/shared";

interface FitSummaryResponse {
  data: FitSummary;
}

interface FitInspectionsResponse {
  data: FitInspectionRecord[];
}

export function useFitSummary(assetId: number) {
  return useQuery<FitSummaryResponse>({
    queryKey: ["assets", assetId, "fit-summary"],
    queryFn: () => apiClient.fit.summary(assetId) as Promise<FitSummaryResponse>,
    enabled: assetId > 0,
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

export function useFitInspections(assetId: number) {
  return useQuery<FitInspectionsResponse>({
    queryKey: ["assets", assetId, "fit-inspections"],
    queryFn: () => apiClient.fit.inspections(assetId) as Promise<FitInspectionsResponse>,
    enabled: assetId > 0,
  });
}
