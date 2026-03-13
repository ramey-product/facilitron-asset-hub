"use client";

import { useState, useRef } from "react";
import {
  FileText,
  File,
  Image as ImageIcon,
  FileSpreadsheet,
  FileWarning,
  Upload,
  Trash2,
  ExternalLink,
  Clock,
  HardDrive,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";
import { useAssetDocuments, useUploadDocument, useDeleteDocument } from "@/hooks/use-documents";
import type { AssetDocument, DocumentType } from "@asset-hub/shared";

interface DocumentListProps {
  assetId: number;
}

const DOC_TYPE_CONFIG: Record<DocumentType, { label: string; icon: typeof FileText; color: string }> = {
  manual: {
    label: "Manual",
    icon: FileText,
    color: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-400/10 dark:text-blue-400 dark:border-blue-400/20",
  },
  warranty: {
    label: "Warranty",
    icon: FileWarning,
    color: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20",
  },
  inspection: {
    label: "Inspection",
    icon: File,
    color: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/20",
  },
  invoice: {
    label: "Invoice",
    icon: FileSpreadsheet,
    color: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-400/10 dark:text-purple-400 dark:border-purple-400/20",
  },
  other: {
    label: "Other",
    icon: File,
    color: "bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-400/10 dark:text-zinc-400 dark:border-zinc-400/20",
  },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return ImageIcon;
  if (mimeType === "application/pdf") return FileText;
  if (
    mimeType.includes("spreadsheet") ||
    mimeType.includes("excel") ||
    mimeType.includes("csv")
  )
    return FileSpreadsheet;
  return File;
}

export function DocumentList({ assetId }: DocumentListProps) {
  const { data, isLoading } = useAssetDocuments(assetId);
  const uploadMutation = useUploadDocument(assetId);
  const deleteMutation = useDeleteDocument(assetId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadType, setUploadType] = useState<DocumentType>("other");

  const documents: AssetDocument[] = data?.data ?? [];

  const handleUpload = (files: FileList | null) => {
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;
      uploadMutation.mutate({
        filename: file.name,
        mimeType: file.type || "application/octet-stream",
        sizeBytes: file.size,
        documentType: uploadType,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-16 animate-pulse rounded-lg bg-[var(--muted)]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Upload Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label
                htmlFor="doc-type-select"
                className="text-xs font-medium text-[var(--muted-foreground)]"
              >
                Type:
              </label>
              <select
                id="doc-type-select"
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value as DocumentType)}
                className="h-8 rounded-md border border-[var(--border)] bg-[var(--background)] px-2 text-xs text-[var(--foreground)]"
              >
                {Object.entries(DOC_TYPE_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {cfg.label}
                  </option>
                ))}
              </select>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
            >
              <Upload className="mr-2 h-3.5 w-3.5" />
              {uploadMutation.isPending ? "Uploading..." : "Upload Document"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
              aria-label="Select document file to upload"
            />
          </div>
        </CardContent>
      </Card>

      {/* Document List */}
      {documents.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="mx-auto h-8 w-8 text-[var(--muted-foreground)]" />
            <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">
              No documents yet
            </h3>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Upload manuals, warranties, inspection reports, and invoices.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => {
            const typeConfig = DOC_TYPE_CONFIG[doc.documentType] ?? DOC_TYPE_CONFIG.other;
            const FileIcon = getFileIcon(doc.mimeType);

            return (
              <Card key={doc.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {/* File Icon */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--muted)]">
                      <FileIcon className="h-5 w-5 text-[var(--muted-foreground)]" />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-[var(--foreground)]">
                          {doc.filename}
                        </span>
                        <Badge
                          className={cn("text-[10px] border shrink-0", typeConfig.color)}
                        >
                          {typeConfig.label}
                        </Badge>
                      </div>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(doc.uploadedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <HardDrive className="h-3 w-3" />
                          {formatFileSize(doc.sizeBytes)}
                        </span>
                      </div>
                      {doc.description && (
                        <p className="mt-1 truncate text-xs text-[var(--muted-foreground)]">
                          {doc.description}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                        aria-label={`Open ${doc.filename} in new tab`}
                        title="Open document"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <button
                        onClick={() => deleteMutation.mutate(doc.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--muted-foreground)] hover:bg-[var(--destructive)]/10 hover:text-[var(--destructive)]"
                        aria-label={`Delete document ${doc.filename}`}
                        title="Delete document"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
