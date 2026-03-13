"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  ReportSchedule,
  ReportDelivery,
  ReportPreview,
  PaginationMeta,
  CreateReportScheduleInput,
  UpdateReportScheduleInput,
} from "@asset-hub/shared";

interface ScheduleListResponse {
  data: ReportSchedule[];
  meta: PaginationMeta;
}

interface ScheduleResponse {
  data: ReportSchedule;
}

interface DeliveryListResponse {
  data: ReportDelivery[];
  meta: PaginationMeta;
}

interface PreviewResponse {
  data: ReportPreview;
}

export function useReportSchedules(params?: Record<string, string | number>) {
  return useQuery<ScheduleListResponse>({
    queryKey: ["report-schedules", params],
    queryFn: () =>
      apiClient.reports.listSchedules(params) as Promise<ScheduleListResponse>,
  });
}

export function useReportSchedule(id: number) {
  return useQuery<ScheduleResponse>({
    queryKey: ["report-schedule", id],
    queryFn: () =>
      apiClient.reports.getSchedule(id) as Promise<ScheduleResponse>,
    enabled: id > 0,
  });
}

export function useCreateReportSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReportScheduleInput) =>
      apiClient.reports.createSchedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-schedules"] });
    },
  });
}

export function useUpdateReportSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateReportScheduleInput }) =>
      apiClient.reports.updateSchedule(id, data),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["report-schedule", id] });
      queryClient.invalidateQueries({ queryKey: ["report-schedules"] });
    },
  });
}

export function useDeleteReportSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.reports.deleteSchedule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-schedules"] });
    },
  });
}

export function useReportDeliveries(params?: Record<string, string | number>) {
  return useQuery<DeliveryListResponse>({
    queryKey: ["report-deliveries", params],
    queryFn: () =>
      apiClient.reports.listDeliveries(params) as Promise<DeliveryListResponse>,
  });
}

export function useRetryDelivery() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.reports.retryDelivery(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report-deliveries"] });
    },
  });
}

export function useReportPreview(scheduleId: number) {
  return useQuery<PreviewResponse>({
    queryKey: ["report-preview", scheduleId],
    queryFn: () =>
      apiClient.reports.previewReport(scheduleId) as Promise<PreviewResponse>,
    enabled: scheduleId > 0,
    staleTime: 30 * 1000, // preview data is fairly fresh
  });
}
