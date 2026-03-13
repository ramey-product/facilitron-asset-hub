"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useConsumablesKPIs() {
  return useQuery({
    queryKey: ["consumables-kpis"],
    queryFn: () => apiClient.consumablesDashboard.getKPIs(),
  });
}

export function useUsageTrends() {
  return useQuery({
    queryKey: ["consumables-trends"],
    queryFn: () => apiClient.consumablesDashboard.getTrends(),
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ["consumables-activity"],
    queryFn: () => apiClient.consumablesDashboard.getActivity(),
  });
}
