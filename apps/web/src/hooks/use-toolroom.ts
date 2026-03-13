"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useToolCheckouts(params?: Record<string, string | number>) {
  return useQuery({
    queryKey: ["tool-checkouts", params],
    queryFn: () => apiClient.toolroom.list(params),
  });
}

export function useToolroomStats() {
  return useQuery({
    queryKey: ["toolroom-stats"],
    queryFn: () => apiClient.toolroom.getStats(),
  });
}

export function useCheckoutTool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => apiClient.toolroom.checkout(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tool-checkouts"] });
      queryClient.invalidateQueries({ queryKey: ["toolroom-stats"] });
    },
  });
}

export function useReturnTool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: unknown }) =>
      apiClient.toolroom.return(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tool-checkouts"] });
      queryClient.invalidateQueries({ queryKey: ["toolroom-stats"] });
    },
  });
}
