"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  ArrowRight,
  RotateCcw,
  Clock,
} from "lucide-react";
import type { ImportResult } from "@asset-hub/shared";

interface ResultsStepProps {
  result: ImportResult;
  onReset: () => void;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const secs = ms / 1000;
  if (secs < 60) return `${secs.toFixed(1)}s`;
  const mins = Math.floor(secs / 60);
  const remainSecs = Math.round(secs % 60);
  return `${mins}m ${remainSecs}s`;
}

function downloadFailedRows(result: ImportResult) {
  if (result.errors.length === 0) return;
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
  a.download = `import-failures-${result.importId}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

type ResultStatus = "success" | "partial" | "failure";

function getStatus(result: ImportResult): ResultStatus {
  if (result.failed === 0 && (result.created + result.updated) > 0) return "success";
  if (result.created + result.updated > 0) return "partial";
  return "failure";
}

const statusConfig: Record<ResultStatus, {
  icon: typeof CheckCircle;
  title: string;
  iconClass: string;
  bgClass: string;
  borderClass: string;
}> = {
  success: {
    icon: CheckCircle,
    title: "Import Complete",
    iconClass: "text-emerald-500",
    bgClass: "bg-emerald-500/10",
    borderClass: "border-emerald-500/30",
  },
  partial: {
    icon: AlertTriangle,
    title: "Import Completed with Errors",
    iconClass: "text-amber-500",
    bgClass: "bg-amber-500/10",
    borderClass: "border-amber-500/30",
  },
  failure: {
    icon: XCircle,
    title: "Import Failed",
    iconClass: "text-[var(--destructive)]",
    bgClass: "bg-[var(--destructive)]/10",
    borderClass: "border-[var(--destructive)]/30",
  },
};

export function ResultsStep({ result, onReset }: ResultsStepProps) {
  const status = getStatus(result);
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="space-y-6">
      {/* Hero card */}
      <Card className={cn("border-2", config.borderClass)}>
        <CardContent className="flex flex-col items-center p-8 text-center">
          <div className={cn("flex h-16 w-16 items-center justify-center rounded-full", config.bgClass)}>
            <Icon className={cn("h-8 w-8", config.iconClass)} />
          </div>
          <h2 className="mt-4 text-xl font-bold text-[var(--foreground)]">{config.title}</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            {status === "success" && "All assets were imported successfully."}
            {status === "partial" && "Some rows had errors and were skipped."}
            {status === "failure" && "No assets were imported. All rows had errors."}
          </p>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-[var(--foreground)]">{result.totalRows}</p>
            <p className="text-xs text-[var(--muted-foreground)]">Total Rows</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {result.created}
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">Created</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {result.updated}
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">Updated</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p
              className={cn(
                "text-2xl font-bold",
                result.failed > 0
                  ? "text-[var(--destructive)]"
                  : "text-emerald-600 dark:text-emerald-400"
              )}
            >
              {result.failed}
            </p>
            <p className="text-xs text-[var(--muted-foreground)]">Failed</p>
          </CardContent>
        </Card>
      </div>

      {/* Duration */}
      <div className="flex items-center justify-center gap-2 text-sm text-[var(--muted-foreground)]">
        <Clock className="h-4 w-4" />
        <span>Completed in {formatDuration(result.duration)}</span>
      </div>

      {/* Error download */}
      {result.errors.length > 0 && (
        <div className="flex items-center justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadFailedRows(result)}
          >
            <Download className="mr-2 h-4 w-4" />
            Download Failed Rows ({result.errors.length})
          </Button>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Import More
        </Button>
        <Link href="/assets">
          <Button>
            View Assets
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
