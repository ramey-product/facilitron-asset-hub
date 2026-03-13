"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileSpreadsheet,
  Loader2,
  Upload,
} from "lucide-react";
import { useImportExecute } from "@/hooks/use-import";
import type { ImportValidationResult, ImportResult } from "@asset-hub/shared";
import type { ParsedFile } from "./ImportWizard";

interface ConfirmStepProps {
  validationResult: ImportValidationResult;
  parsedFile: ParsedFile;
  mappings: Record<string, string>;
  onExecute: (result: ImportResult) => void;
  onBack: () => void;
}

export function ConfirmStep({
  validationResult,
  parsedFile,
  mappings,
  onExecute,
  onBack,
}: ConfirmStepProps) {
  const executeMutation = useImportExecute();

  const handleExecute = () => {
    executeMutation.mutate(
      {
        rows: parsedFile.rows,
        mappings,
        skipErrors: true,
      },
      {
        onSuccess: (response) => {
          onExecute(response.data);
        },
      }
    );
  };

  const hasErrors = validationResult.errorRows > 0;
  const allErrors = validationResult.validRows === 0;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Confirm Import</h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          Review the summary below and confirm to start importing.
        </p>
      </div>

      {/* File info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--primary)]/10">
              <FileSpreadsheet className="h-6 w-6 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">{parsedFile.filename}</p>
              <p className="text-xs text-[var(--muted-foreground)]">
                {Object.keys(mappings).length} columns mapped
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-3xl font-bold text-[var(--foreground)]">
              {validationResult.totalRows}
            </p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Total Rows</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6 text-emerald-500" />
              <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {validationResult.validRows}
              </p>
            </div>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Will be imported</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-center">
            <div className="flex items-center justify-center gap-2">
              {hasErrors ? (
                <XCircle className="h-6 w-6 text-[var(--destructive)]" />
              ) : (
                <CheckCircle className="h-6 w-6 text-emerald-500" />
              )}
              <p
                className={cn(
                  "text-3xl font-bold",
                  hasErrors
                    ? "text-[var(--destructive)]"
                    : "text-emerald-600 dark:text-emerald-400"
                )}
              >
                {validationResult.errorRows}
              </p>
            </div>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">Will be skipped</p>
          </CardContent>
        </Card>
      </div>

      {/* Warning for partial import */}
      {hasErrors && !allErrors && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
              Partial import
            </p>
            <p className="text-sm text-[var(--muted-foreground)]">
              {validationResult.errorRows} row{validationResult.errorRows !== 1 ? "s" : ""} with
              errors will be skipped. Only {validationResult.validRows} valid row
              {validationResult.validRows !== 1 ? "s" : ""} will be imported.
            </p>
          </div>
        </div>
      )}

      {/* All errors - can't proceed */}
      {allErrors && (
        <div className="flex items-start gap-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/5 p-4">
          <XCircle className="h-5 w-5 shrink-0 text-[var(--destructive)]" />
          <div>
            <p className="text-sm font-medium text-[var(--destructive)]">Cannot import</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              All rows have validation errors. Go back to fix the mapping or update your file.
            </p>
          </div>
        </div>
      )}

      {/* API error */}
      {executeMutation.isError && (
        <div className="flex items-start gap-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/5 p-4">
          <XCircle className="h-5 w-5 shrink-0 text-[var(--destructive)]" />
          <div>
            <p className="text-sm font-medium text-[var(--destructive)]">Import failed</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              {executeMutation.error.message}
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={onBack} disabled={executeMutation.isPending}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleExecute}
          disabled={allErrors || executeMutation.isPending}
        >
          {executeMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Importing...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Import {validationResult.validRows} Asset{validationResult.validRows !== 1 ? "s" : ""}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
