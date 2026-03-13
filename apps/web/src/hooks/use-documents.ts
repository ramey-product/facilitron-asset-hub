"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { AssetPhoto, AssetDocument } from "@asset-hub/shared";

interface PhotosResponse {
  data: AssetPhoto[];
}

interface DocumentsResponse {
  data: AssetDocument[];
}

// ---- Photo Hooks ----

export function useAssetPhotos(assetId: number) {
  return useQuery<PhotosResponse>({
    queryKey: ["assets", assetId, "photos"],
    queryFn: () => apiClient.photos.list(assetId) as Promise<PhotosResponse>,
    enabled: assetId > 0,
  });
}

export function useUploadPhoto(assetId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { filename: string; mimeType: string; sizeBytes: number; caption?: string }) =>
      apiClient.photos.upload(assetId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets", assetId, "photos"] });
    },
  });
}

export function useDeletePhoto(assetId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (photoId: number) => apiClient.photos.delete(assetId, photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets", assetId, "photos"] });
    },
  });
}

export function useSetPrimaryPhoto(assetId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (photoId: number) => apiClient.photos.setPrimary(assetId, photoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets", assetId, "photos"] });
    },
  });
}

// ---- Document Hooks ----

export function useAssetDocuments(assetId: number) {
  return useQuery<DocumentsResponse>({
    queryKey: ["assets", assetId, "documents"],
    queryFn: () => apiClient.documents.list(assetId) as Promise<DocumentsResponse>,
    enabled: assetId > 0,
  });
}

export function useUploadDocument(assetId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      filename: string;
      mimeType: string;
      sizeBytes: number;
      documentType: string;
      description?: string;
    }) => apiClient.documents.upload(assetId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets", assetId, "documents"] });
    },
  });
}

export function useDeleteDocument(assetId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (docId: number) => apiClient.documents.delete(assetId, docId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assets", assetId, "documents"] });
    },
  });
}
