"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  ImportValidationResult,
  ImportResult,
  ImportHistoryEntry,
  ImportFieldDefinition,
} from "@asset-hub/shared";
import type { ApiResponse } from "@asset-hub/shared";

export function useImportValidate() {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<ImportValidationResult>,
    Error,
    { rows: Record<string, unknown>[]; mappings: Record<string, string> }
  >({
    mutationFn: (data) =>
      apiClient.import.validate(data) as Promise<ApiResponse<ImportValidationResult>>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["import", "history"] });
    },
  });
}

export function useImportExecute() {
  const queryClient = useQueryClient();
  return useMutation<
    ApiResponse<ImportResult>,
    Error,
    { rows: Record<string, unknown>[]; mappings: Record<string, string>; skipErrors: boolean }
  >({
    mutationFn: (data) =>
      apiClient.import.execute(data) as Promise<ApiResponse<ImportResult>>,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets"] });
      queryClient.invalidateQueries({ queryKey: ["import", "history"] });
    },
  });
}

export function useImportHistory(params?: Record<string, string | number>) {
  return useQuery<ApiResponse<ImportHistoryEntry[]>>({
    queryKey: ["import", "history", params],
    queryFn: () =>
      apiClient.import.history(params) as Promise<ApiResponse<ImportHistoryEntry[]>>,
  });
}

export function useImportTemplate() {
  return useQuery<ApiResponse<ImportFieldDefinition[]>>({
    queryKey: ["import", "template"],
    queryFn: () =>
      apiClient.import.template() as Promise<ApiResponse<ImportFieldDefinition[]>>,
  });
}
