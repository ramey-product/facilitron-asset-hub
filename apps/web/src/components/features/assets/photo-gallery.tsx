"use client";

import { useState, useCallback, useRef } from "react";
import {
  Camera,
  Star,
  Trash2,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  ImageOff,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  useAssetPhotos,
  useUploadPhoto,
  useDeletePhoto,
  useSetPrimaryPhoto,
} from "@/hooks/use-documents";
import type { AssetPhoto } from "@asset-hub/shared";

interface PhotoGalleryProps {
  assetId: number;
}

export function PhotoGallery({ assetId }: PhotoGalleryProps) {
  const { data, isLoading } = useAssetPhotos(assetId);
  const uploadMutation = useUploadPhoto(assetId);
  const deleteMutation = useDeletePhoto(assetId);
  const setPrimaryMutation = useSetPrimaryPhoto(assetId);

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photos: AssetPhoto[] = data?.data ?? [];

  const handleFileSelect = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file || !file.type.startsWith("image/")) continue;
        uploadMutation.mutate({
          filename: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
        });
      }
    },
    [uploadMutation]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const lightboxPrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : photos.length - 1);
  };

  const lightboxNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(lightboxIndex < photos.length - 1 ? lightboxIndex + 1 : 0);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-lg bg-[var(--muted)]"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 transition-colors",
          isDragOver
            ? "border-[var(--primary)] bg-[var(--primary)]/5"
            : "border-[var(--border)] hover:border-[var(--muted-foreground)]"
        )}
        role="button"
        tabIndex={0}
        aria-label="Upload photos. Drag and drop images or click to browse."
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <Upload className="h-8 w-8 text-[var(--muted-foreground)]" />
        <div className="text-center">
          <p className="text-sm font-medium text-[var(--foreground)]">
            {isDragOver ? "Drop images here" : "Drag & drop photos or click to upload"}
          </p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            JPG, PNG, GIF, WebP up to 50MB
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          aria-label="Select image files to upload"
        />
      </div>

      {/* Photo Grid */}
      {photos.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Camera className="mx-auto h-8 w-8 text-[var(--muted-foreground)]" />
            <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">
              No photos yet
            </h3>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Upload photos to document this asset&apos;s condition and installation.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.id}
              className="group relative aspect-square overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--muted)]"
            >
              {/* Thumbnail */}
              <button
                onClick={() => openLightbox(index)}
                className="h-full w-full"
                aria-label={`View ${photo.filename}${photo.isPrimary ? " (primary photo)" : ""}`}
              >
                <img
                  src={photo.thumbnailUrl || photo.url}
                  alt={photo.caption || photo.filename}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
              </button>

              {/* Primary Badge */}
              {photo.isPrimary && (
                <Badge className="absolute left-2 top-2 text-[10px] bg-[var(--primary)] text-white">
                  <Star className="mr-1 h-3 w-3" />
                  Primary
                </Badge>
              )}

              {/* Hover Actions */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-3 py-2 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="truncate text-xs text-white">
                  {photo.caption || photo.filename}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  {!photo.isPrimary && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPrimaryMutation.mutate(photo.id);
                      }}
                      className="rounded p-1 text-white/80 hover:bg-white/20 hover:text-white"
                      aria-label="Set as primary photo"
                      title="Set as primary"
                    >
                      <Star className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMutation.mutate(photo.id);
                    }}
                    className="rounded p-1 text-white/80 hover:bg-red-500/60 hover:text-white"
                    aria-label={`Delete photo ${photo.filename}`}
                    title="Delete photo"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && photos[lightboxIndex] && (
        <Lightbox
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={lightboxPrev}
          onNext={lightboxNext}
        />
      )}
    </div>
  );
}

// ---- Lightbox Component ----

interface LightboxProps {
  photos: AssetPhoto[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

function Lightbox({ photos, currentIndex, onClose, onPrev, onNext }: LightboxProps) {
  const photo = photos[currentIndex];
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      role="dialog"
      aria-label="Photo lightbox"
      aria-modal="true"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowLeft") onPrev();
        if (e.key === "ArrowRight") onNext();
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
        aria-label="Close lightbox"
      >
        <X className="h-5 w-5" />
      </button>

      {/* Previous */}
      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
          aria-label="Previous photo"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Image */}
      <div
        className="max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.url}
          alt={photo.caption || photo.filename}
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />
      </div>

      {/* Next */}
      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
          aria-label="Next photo"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Caption + Counter */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-sm text-white/80">
          {photo.caption || photo.filename}
        </p>
        <p className="mt-1 text-xs text-white/60">
          {currentIndex + 1} of {photos.length}
        </p>
      </div>
    </div>
  );
}
