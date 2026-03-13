"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useGenerateReport() {
  return useMutation({
    mutationFn: (data: unknown) => apiClient.inventoryReports.generate(data),
  });
}

export function useReportTemplates(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["report-templates", params],
    queryFn: () => apiClient.inventoryReports.listTemplates(params),
  });
}

export function useReportTemplate(id: number) {
  return useQuery({
    queryKey: ["report-template", id],
    queryFn: () => apiClient.inventoryReports.getTemplate(id),
    enabled: !!id,
  });
}

export function useCreateReportTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => apiClient.inventoryReports.createTemplate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-templates"] });
    },
  });
}

export function useUpdateReportTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) =>
      apiClient.inventoryReports.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-templates"] });
      queryClient.invalidateQueries({ queryKey: ["report-template"] });
    },
  });
}

export function useDeleteReportTemplate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.inventoryReports.deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-templates"] });
    },
  });
}
