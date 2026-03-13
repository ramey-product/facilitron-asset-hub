"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { CustomFieldDefinition, CustomFieldValue } from "@asset-hub/shared";

interface DefinitionsResponse {
  data: CustomFieldDefinition[];
}

interface ValuesResponse {
  data: CustomFieldValue[];
}

export function useCustomFieldDefinitions() {
  return useQuery<DefinitionsResponse>({
    queryKey: ["custom-fields", "definitions"],
    queryFn: () => apiClient.customFields.definitions() as Promise<DefinitionsResponse>,
    staleTime: 10 * 60 * 1000, // 10 min — definitions change rarely
  });
}

export function useAssetCustomFields(assetId: number) {
  return useQuery<ValuesResponse>({
    queryKey: ["assets", assetId, "custom-fields"],
    queryFn: () => apiClient.customFields.getValues(assetId) as Promise<ValuesResponse>,
    enabled: assetId > 0,
  });
}

export function useUpdateCustomFields(assetId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { values: { definitionId: number; value: string | number | boolean | null }[] }) =>
      apiClient.customFields.updateValues(assetId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets", assetId, "custom-fields"] });
    },
  });
}
