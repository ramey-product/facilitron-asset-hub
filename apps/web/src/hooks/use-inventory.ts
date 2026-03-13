"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  PartRecord,
  PartCategory,
  PaginationMeta,
  CreatePartInput,
  UpdatePartInput,
} from "@asset-hub/shared";

interface PartListResponse {
  data: PartRecord[];
  meta: PaginationMeta;
}

interface PartDetailResponse {
  data: PartRecord;
}

interface PartCategoriesResponse {
  data: PartCategory[];
}

export function useParts(params?: Record<string, string | number>) {
  return useQuery<PartListResponse>({
    queryKey: ["parts", params],
    queryFn: () => apiClient.inventory.list(params) as Promise<PartListResponse>,
  });
}

export function usePartDetail(id: number) {
  return useQuery<PartDetailResponse>({
    queryKey: ["parts", id],
    queryFn: () => apiClient.inventory.getById(id) as Promise<PartDetailResponse>,
    enabled: id > 0,
  });
}

export function usePartCategories() {
  return useQuery<PartCategoriesResponse>({
    queryKey: ["part-categories"],
    queryFn: () => apiClient.inventory.categories() as Promise<PartCategoriesResponse>,
    staleTime: 5 * 60 * 1000, // categories are fairly static
  });
}

export function useCreatePart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreatePartInput) =>
      apiClient.inventory.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      queryClient.invalidateQueries({ queryKey: ["part-categories"] });
    },
  });
}

export function useUpdatePart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePartInput }) =>
      apiClient.inventory.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
    },
  });
}

export function useDeletePart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.inventory.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      queryClient.invalidateQueries({ queryKey: ["part-categories"] });
    },
  });
}
