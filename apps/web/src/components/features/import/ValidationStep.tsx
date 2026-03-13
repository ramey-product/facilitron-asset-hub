"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Loader2,
} from "lucide-react";
import { useImportValidate } from "@/hooks/use-import";
import type { ImportValidationResult } from "@asset-hub/shared/types/import.js";
import type { ParsedFile } from "./ImportWizard";

interface ValidationStepProps {
  parsedFile: ParsedFile;
  mappings: Record<string, string>;
  onValidated: (result: ImportValidationResult) => void;
  onBack: () => void;
}

function downloadErrorReport(result: ImportValidationResult) {
  const lines = ["Row,Field,Value,Error,Suggestion"];
  for (const err of result.errors) {
    lines.push(
      [err.row, err.field, `"${err.value}"`, `"${err.message}"`, `"${err.suggestion ?? ""}"`].join(",")
    );
  }
  const csv = lines.join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "import-errors.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function ValidationStep({ parsedFile, mappings, onValidated, onBack }: ValidationStepProps) {
  const validateMutation = useImportValidate();

  useEffect(() => {
    if (!validateMutation.data && !validateMutation.isPending && !validateMutation.isError) {
      validateMutation.mutate({ rows: parsedFile.rows, mappings });
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const result = validateMutation.data?.data ?? null;

  // Build preview rows from the API result or from local parsed data
  const previewRows = result?.preview ?? parsedFile.rows.slice(0, 10);

  // Build error lookup: row -> field -> error message
  const errorLookup = new Map<string, string>();
  if (result) {
    for (const err of result.errors) {
      errorLookup.set(`${err.row}:${err.field}`, err.message);
    }
  }

  // The mapped field names for display
  const mappedHeaders = Object.entries(mappings).map(([source, target]) => ({
    source,
    target,
  }));

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Validation Preview</h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          Reviewing your data for errors before import.
        </p>
      </div>

      {/* Loading state */}
      {validateMutation.isPending && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-10 w-10 animate-spin text-[var(--primary)]" />
            <p className="mt-4 text-sm font-medium text-[var(--foreground)]">
              Validating {parsedFile.rows.length} rows...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error state */}
      {validateMutation.isError && (
        <div className="flex items-start gap-3 rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/5 p-4">
          <XCircle className="h-5 w-5 shrink-0 text-[var(--destructive)]" />
          <div>
            <p className="text-sm font-medium text-[var(--destructive)]">Validation failed</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              {validateMutation.error.message}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => validateMutation.mutate({ rows: parsedFile.rows, mappings })}
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Validation results */}
      {result && (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-[var(--foreground)]">{result.totalRows}</p>
                <p className="text-xs text-[var(--muted-foreground)]">Total Rows</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {result.validRows}
                  </p>
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">Valid</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  {result.errorRows > 0 ? (
                    <XCircle className="h-5 w-5 text-[var(--destructive)]" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  )}
                  <p
                    className={cn(
                      "text-2xl font-bold",
                      result.errorRows > 0
                        ? "text-[var(--destructive)]"
                        : "text-emerald-600 dark:text-emerald-400"
                    )}
                  >
                    {result.errorRows}
                  </p>
                </div>
                <p className="text-xs text-[var(--muted-foreground)]">Errors</p>
              </CardContent>
            </Card>
          </div>

          {/* Error summary */}
          {result.errors.length > 0 && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
              <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                  {result.errors.length} validation error{result.errors.length !== 1 ? "s" : ""} found
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Rows with errors will be skipped during import. Download the error report for details.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadErrorReport(result)}
                className="shrink-0"
              >
                <Download className="mr-2 h-3 w-3" />
                Error Report
              </Button>
            </div>
          )}

          {/* Preview table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Preview (first {Math.min(10, previewRows.length)} rows)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm" role="table">
                  <thead className="sticky top-0 bg-[var(--muted)]">
                    <tr>
                      <th className="whitespace-nowrap px-4 py-2 text-left text-xs font-medium text-[var(--muted-foreground)]">
                        Row
                      </th>
                      {mappedHeaders.map(({ source, target }) => (
                        <th
                          key={source}
                          className="whitespace-nowrap px-4 py-2 text-left text-xs font-medium text-[var(--muted-foreground)]"
                        >
                          {target}
                        </th>
                      ))}
                      <th className="whitespace-nowrap px-4 py-2 text-left text-xs font-medium text-[var(--muted-foreground)]">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.slice(0, 10).map((row, rowIdx) => {
                      const rowNum = rowIdx + 1;
                      const rowErrors = result.errors.filter((e) => e.row === rowNum);
                      const hasError = rowErrors.length > 0;
                      return (
                        <tr
                          key={rowIdx}
                          className={cn(
                            "border-t border-[var(--border)] transition-colors",
                            hasError ? "bg-[var(--destructive)]/5" : "hover:bg-[var(--muted)]/30"
                          )}
                        >
                          <td className="px-4 py-2 text-xs text-[var(--muted-foreground)]">
                            {rowNum}
                          </td>
                          {mappedHeaders.map(({ source, target }) => {
                            const value = String(row[source] ?? row[target] ?? "");
                            const cellError = errorLookup.get(`${rowNum}:${target}`);
                            return (
                              <td
                                key={source}
                                className="px-4 py-2"
                                title={cellError ?? undefined}
                              >
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={cn(
                                      "truncate max-w-[160px] text-xs",
                                      cellError
                                        ? "text-[var(--destructive)] font-medium"
                                        : "text-[var(--foreground)]"
                                    )}
                                  >
                                    {value || "(empty)"}
                                  </span>
                                  {cellError ? (
                                    <XCircle className="h-3.5 w-3.5 shrink-0 text-[var(--destructive)]" />
                                  ) : value ? (
                                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                  ) : null}
                                </div>
                              </td>
                            );
                          })}
                          <td className="px-4 py-2">
                            {hasError ? (
                              <span className="inline-flex items-center gap-1 text-xs text-[var(--destructive)]">
                                <XCircle className="h-3.5 w-3.5" />
                                {rowErrors.length} error{rowErrors.length !== 1 ? "s" : ""}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                                <CheckCircle className="h-3.5 w-3.5" />
                                Valid
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={() => result && onValidated(result)}
          disabled={!result || validateMutation.isPending}
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
