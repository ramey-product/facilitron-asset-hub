"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileSpreadsheet,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  ArrowLeft,
  Upload,
  Loader2,
} from "lucide-react";
import { useImportHistory } from "@/hooks/use-import";

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const secs = ms / 1000;
  if (secs < 60) return `${secs.toFixed(1)}s`;
  const mins = Math.floor(secs / 60);
  const remainSecs = Math.round(secs % 60);
  return `${mins}m ${remainSecs}s`;
}

export function ImportHistoryClient() {
  const { data, isLoading, isError, error } = useImportHistory();
  const entries = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <Card>
          <CardContent className="p-6 text-center">
            <XCircle className="mx-auto h-8 w-8 text-[var(--destructive)]" />
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              {error.message}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Actions */}
      <div className="flex items-center justify-between">
        <Link href="/assets/import">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Import
          </Button>
        </Link>
        <Link href="/assets/import">
          <Button size="sm">
            <Upload className="mr-2 h-4 w-4" />
            New Import
          </Button>
        </Link>
      </div>

      {/* Empty state */}
      {entries.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center p-12 text-center">
            <FileSpreadsheet className="h-12 w-12 text-[var(--muted-foreground)]" />
            <h3 className="mt-4 text-sm font-semibold text-[var(--foreground)]">
              No imports yet
            </h3>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Start your first bulk import to see history here.
            </p>
            <Link href="/assets/import" className="mt-4">
              <Button size="sm">
                <Upload className="mr-2 h-4 w-4" />
                Import Assets
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* History table */}
      {entries.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              {entries.length} import{entries.length !== 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead className="bg-[var(--muted)]">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-[var(--muted-foreground)]">
                      File
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-[var(--muted-foreground)]">
                      Date
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium text-[var(--muted-foreground)]">
                      User
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-medium text-[var(--muted-foreground)]">
                      Total
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-medium text-[var(--muted-foreground)]">
                      Created
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-medium text-[var(--muted-foreground)]">
                      Updated
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-medium text-[var(--muted-foreground)]">
                      Failed
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-medium text-[var(--muted-foreground)]">
                      Duration
                    </th>
                    <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-medium text-[var(--muted-foreground)]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => {
                    const hasFailures = entry.failed > 0;
                    const allFailed = entry.created + entry.updated === 0;
                    return (
                      <tr
                        key={entry.id}
                        className="border-t border-[var(--border)] hover:bg-[var(--muted)]/30 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <FileSpreadsheet className="h-4 w-4 shrink-0 text-[var(--primary)]" />
                            <span className="truncate max-w-[200px] font-medium text-[var(--foreground)]">
                              {entry.filename}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[var(--muted-foreground)]">
                          {formatDate(entry.importedAt)}
                        </td>
                        <td className="px-4 py-3 text-[var(--muted-foreground)]">
                          {entry.username}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-[var(--foreground)]">
                          {entry.totalRows}
                        </td>
                        <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400">
                          {entry.created}
                        </td>
                        <td className="px-4 py-3 text-right text-blue-600 dark:text-blue-400">
                          {entry.updated}
                        </td>
                        <td
                          className={cn(
                            "px-4 py-3 text-right",
                            entry.failed > 0 ? "text-[var(--destructive)]" : "text-[var(--muted-foreground)]"
                          )}
                        >
                          {entry.failed}
                        </td>
                        <td className="px-4 py-3 text-right text-[var(--muted-foreground)]">
                          <div className="flex items-center justify-end gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDuration(entry.duration)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {allFailed ? (
                            <Badge className="bg-[var(--destructive)]/10 text-[var(--destructive)] border-[var(--destructive)]/20">
                              <XCircle className="mr-1 h-3 w-3" />
                              Failed
                            </Badge>
                          ) : hasFailures ? (
                            <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Partial
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Success
                            </Badge>
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
      )}
    </div>
  );
}
