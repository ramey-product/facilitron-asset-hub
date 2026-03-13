"use client";

import { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { Upload, FileSpreadsheet, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ParsedFile } from "./ImportWizard";

interface UploadStepProps {
  onFileUploaded: (file: ParsedFile) => void;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function coerceRowToStrings(row: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(row)) {
    out[key] = String(value ?? "");
  }
  return out;
}

async function parseCSV(file: File): Promise<{ headers: string[]; rows: Record<string, string>[] }> {
  const Papa = await import("papaparse");
  return new Promise((resolve, reject) => {
    Papa.default.parse<Record<string, unknown>>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h: string) => h.trim(),
      complete: (results: Papa.ParseResult<Record<string, unknown>>) => {
        const headers = results.meta.fields ?? [];
        const rows = results.data.map(coerceRowToStrings);
        resolve({ headers, rows });
      },
      error: (err: Error) => reject(err),
    });
  });
}

async function parseXLSX(file: File): Promise<{ headers: string[]; rows: Record<string, string>[] }> {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  if (!sheetName) throw new Error("No sheets found in workbook");
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) throw new Error("Failed to read sheet");
  const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" }) as Record<string, unknown>[];
  const headers = jsonData.length > 0 && jsonData[0] ? Object.keys(jsonData[0]) : [];
  return { headers, rows: jsonData.map(coerceRowToStrings) };
}

export function UploadStep({ onFileUploaded }: UploadStepProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED_TYPES = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];
  const ACCEPTED_EXTENSIONS = [".csv", ".xlsx", ".xls"];

  const isAcceptedFile = (file: File): boolean => {
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    return ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.includes(ext);
  };

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      if (!isAcceptedFile(file)) {
        setError("Only .csv and .xlsx files are supported.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be under 10 MB.");
        return;
      }
      setSelectedFile(file);
      setParsing(true);
      try {
        const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
        const result =
          ext === ".csv" ? await parseCSV(file) : await parseXLSX(file);
        if (result.headers.length === 0) {
          setError("File appears to be empty or has no column headers.");
          setParsing(false);
          return;
        }
        if (result.rows.length === 0) {
          setError("File has headers but no data rows.");
          setParsing(false);
          return;
        }
        onFileUploaded({
          filename: file.name,
          size: file.size,
          headers: result.headers,
          rows: result.rows,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to parse file.");
      } finally {
        setParsing(false);
      }
    },
    [onFileUploaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Upload Asset Data</h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          Upload a CSV or Excel file containing your asset data. The first row should contain column headers.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Upload file. Drag and drop or click to browse."
        className={cn(
          "cursor-pointer rounded-xl border-2 border-dashed p-12 text-center transition-all",
          isDragOver
            ? "border-[var(--primary)] bg-[var(--primary)]/10"
            : "border-[var(--muted-foreground)]/30 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="hidden"
          aria-hidden="true"
        />

        {parsing ? (
          <div className="space-y-3">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[var(--primary)]/30 border-t-[var(--primary)]" />
            <p className="text-sm font-medium text-[var(--foreground)]">
              Parsing {selectedFile?.name}...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)]/10">
              <Upload className="h-7 w-7 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">
                Drag & drop your file here, or click to browse
              </p>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Supports .csv and .xlsx files up to 10 MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Selected file indicator */}
      {selectedFile && !parsing && (
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <FileSpreadsheet className="h-8 w-8 text-[var(--primary)]" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--foreground)] truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-[var(--muted-foreground)]">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
                setError(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              aria-label="Remove file"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/5 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-[var(--destructive)]" />
          <div>
            <p className="text-sm font-medium text-[var(--destructive)]">Upload Error</p>
            <p className="text-sm text-[var(--muted-foreground)]">{error}</p>
          </div>
        </div>
      )}

      {/* Template download link */}
      <div className="text-center">
        <p className="text-xs text-[var(--muted-foreground)]">
          Need a template?{" "}
          <button
            className="text-[var(--primary)] underline hover:no-underline"
            onClick={() => {
              // Generate a simple CSV template
              const headers = [
                "Asset Name",
                "Category",
                "Property",
                "Serial Number",
                "Barcode",
                "Model",
                "Manufacturer",
                "Purchase Date",
                "Purchase Cost",
                "Location",
                "Description",
                "Notes",
              ];
              const csv = headers.join(",") + "\n";
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "asset-import-template.csv";
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Download CSV template
          </button>
        </p>
      </div>
    </div>
  );
}
