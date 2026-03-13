"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  VendorRecord,
  VendorPerformance,
  PaginationMeta,
} from "@asset-hub/shared";

interface VendorListResponse {
  data: VendorRecord[];
  meta: PaginationMeta;
}

interface VendorDetailResponse {
  data: VendorRecord;
}

interface VendorPerformanceResponse {
  data: VendorPerformance;
}

interface VendorCompareResponse {
  data: VendorPerformance[];
}

export function useVendors(params?: Record<string, string | number>) {
  return useQuery<VendorListResponse>({
    queryKey: ["vendors", params],
    queryFn: () => apiClient.vendors.list(params) as Promise<VendorListResponse>,
  });
}

export function useVendorDetail(id: number) {
  return useQuery<VendorDetailResponse>({
    queryKey: ["vendors", id],
    queryFn: () => apiClient.vendors.getById(id) as Promise<VendorDetailResponse>,
    enabled: id > 0,
  });
}

export function useVendorPerformance(id: number) {
  return useQuery<VendorPerformanceResponse>({
    queryKey: ["vendor-performance", id],
    queryFn: () => apiClient.vendors.performance(id) as Promise<VendorPerformanceResponse>,
    enabled: id > 0,
  });
}

export function useVendorCompare(ids: number[]) {
  return useQuery<VendorCompareResponse>({
    queryKey: ["vendor-compare", ids],
    queryFn: () => apiClient.vendors.compare(ids) as Promise<VendorCompareResponse>,
    enabled: ids.length >= 2,
  });
}
