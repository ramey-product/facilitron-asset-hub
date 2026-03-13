"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { PropertySummary } from "@asset-hub/shared";

interface PropertiesResponse {
  data: PropertySummary[];
}

export function useProperties() {
  return useQuery<PropertiesResponse>({
    queryKey: ["properties"],
    queryFn: () =>
      apiClient.properties.list() as Promise<PropertiesResponse>,
    staleTime: 10 * 60 * 1000, // 10 minutes — properties rarely change
  });
}

export type { PropertySummary };
