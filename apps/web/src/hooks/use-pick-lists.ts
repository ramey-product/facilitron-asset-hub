"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function usePickLists(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["pick-lists", params],
    queryFn: () => apiClient.pickLists.list(params),
  });
}

export function usePickList(id: number) {
  return useQuery({
    queryKey: ["pick-list", id],
    queryFn: () => apiClient.pickLists.get(id),
    enabled: !!id,
  });
}

export function useCreatePickList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => apiClient.pickLists.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pick-lists"] });
    },
  });
}

export function useUpdatePickListItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      pickListId,
      itemId,
      data,
    }: {
      pickListId: number;
      itemId: number;
      data: unknown;
    }) => apiClient.pickLists.updateItem(pickListId, itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pick-lists"] });
      queryClient.invalidateQueries({ queryKey: ["pick-list"] });
    },
  });
}

export function useCompletePickList() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.pickLists.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pick-lists"] });
      queryClient.invalidateQueries({ queryKey: ["pick-list"] });
    },
  });
}
