"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ClipboardCheck,
  Calendar,
  User,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Shield,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatDate } from "@/lib/utils";
import { useFitSummary, useFitInspections } from "@/hooks/use-fit";
import type { FitInspectionResult, FitInspectionRecord } from "@asset-hub/shared";

interface FitSummaryProps {
  assetId: number;
}

const RESULT_CONFIG: Record<
  FitInspectionResult,
  { label: string; color: string }
> = {
  pass: {
    label: "Pass",
    color:
      "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-400/10 dark:text-emerald-400 dark:border-emerald-400/20",
  },
  fail: {
    label: "Fail",
    color:
      "bg-red-100 text-red-800 border-red-300 dark:bg-red-400/10 dark:text-red-400 dark:border-red-400/20",
  },
  partial: {
    label: "Partial",
    color:
      "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-400/10 dark:text-amber-400 dark:border-amber-400/20",
  },
};

function getConditionLabel(rating: number | null): string {
  if (rating === null) return "Unknown";
  const map: Record<number, string> = {
    5: "Excellent",
    4: "Good",
    3: "Fair",
    2: "Poor",
    1: "Critical",
  };
  return map[rating] ?? "Unknown";
}

export function FitSummaryCard({ assetId }: FitSummaryProps) {
  const { data: summaryData, isLoading: summaryLoading } = useFitSummary(assetId);
  const { data: inspectionsData, isLoading: inspectionsLoading } = useFitInspections(assetId);
  const [expanded, setExpanded] = useState(false);

  const summary = summaryData?.data;
  const inspections: FitInspectionRecord[] = inspectionsData?.data ?? [];

  if (summaryLoading) {
    return (
      <div className="space-y-3">
        <div className="h-40 animate-pulse rounded-lg bg-[var(--muted)]" />
      </div>
    );
  }

  if (!summary) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <ClipboardCheck className="mx-auto h-8 w-8 text-[var(--muted-foreground)]" />
          <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">
            No FIT inspection data
          </h3>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            This asset has no inspection records from the Facilitron Inspection Tool.
          </p>
        </CardContent>
      </Card>
    );
  }

  const resultConfig = summary.lastInspectionResult
    ? RESULT_CONFIG[summary.lastInspectionResult]
    : null;

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              FIT Inspections
            </h3>
            {resultConfig && (
              <Badge className={cn("text-[10px] border", resultConfig.color)}>
                {resultConfig.label}
              </Badge>
            )}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
                Last Inspection
              </div>
              <div className="mt-0.5 text-sm font-medium text-[var(--foreground)]">
                {summary.lastInspectionDate
                  ? formatDate(summary.lastInspectionDate)
                  : "\u2014"}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
                Next Scheduled
              </div>
              <div className="mt-0.5 text-sm font-medium text-[var(--foreground)]">
                {summary.nextScheduledDate
                  ? formatDate(summary.nextScheduledDate)
                  : "\u2014"}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
                Inspector
              </div>
              <div className="mt-0.5 flex items-center gap-1 text-sm text-[var(--foreground)]">
                <User className="h-3 w-3 text-[var(--muted-foreground)]" />
                {summary.inspector ?? "\u2014"}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
                Condition at Inspection
              </div>
              <div className="mt-0.5 text-sm font-medium text-[var(--foreground)]">
                {getConditionLabel(summary.conditionAtLastInspection)}
              </div>
            </div>
          </div>

          {/* Open Deficiencies */}
          {summary.openDeficiencies > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-[var(--destructive)]/10 px-3 py-2">
              <AlertTriangle className="h-4 w-4 text-[var(--destructive)]" />
              <span className="text-xs font-medium text-[var(--destructive)]">
                {summary.openDeficiencies} open deficienc{summary.openDeficiencies === 1 ? "y" : "ies"}
              </span>
            </div>
          )}

          {/* Total Inspections Count */}
          <div className="border-t border-[var(--border)] pt-3 flex items-center justify-between">
            <span className="text-xs text-[var(--muted-foreground)]">
              {summary.inspectionCount} total inspection{summary.inspectionCount !== 1 ? "s" : ""}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs text-[var(--primary)] hover:underline"
                aria-expanded={expanded}
                aria-label={expanded ? "Collapse inspection history" : "Expand inspection history"}
              >
                {expanded ? "Hide" : "View Full"} History
                {expanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inspection History (expandable) */}
      {expanded && (
        <Card>
          <CardContent className="p-5">
            <h4 className="text-sm font-semibold text-[var(--foreground)] mb-3">
              Inspection History
            </h4>
            {inspectionsLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-12 animate-pulse rounded bg-[var(--muted)]"
                  />
                ))}
              </div>
            ) : inspections.length === 0 ? (
              <p className="text-xs text-[var(--muted-foreground)]">
                No inspection records found.
              </p>
            ) : (
              <div className="space-y-2">
                {inspections.map((record) => {
                  const cfg = RESULT_CONFIG[record.result];
                  return (
                    <div
                      key={record.id}
                      className="flex items-center gap-3 rounded-lg border border-[var(--border)] p-3"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[var(--muted)]">
                        <Shield className="h-4 w-4 text-[var(--muted-foreground)]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[var(--foreground)]">
                            {formatDate(record.inspectionDate)}
                          </span>
                          <Badge
                            className={cn("text-[10px] border", cfg.color)}
                          >
                            {cfg.label}
                          </Badge>
                          {record.deficiencyCount > 0 && (
                            <span className="text-[10px] text-[var(--destructive)]">
                              {record.deficiencyCount} deficienc{record.deficiencyCount === 1 ? "y" : "ies"}
                            </span>
                          )}
                        </div>
                        <div className="mt-0.5 flex items-center gap-3 text-xs text-[var(--muted-foreground)]">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {record.inspector}
                          </span>
                          <span>
                            Condition: {getConditionLabel(record.conditionRating)}
                          </span>
                        </div>
                        {record.notes && (
                          <p className="mt-1 truncate text-xs text-[var(--muted-foreground)]">
                            {record.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Open in FIT link */}
            <div className="mt-4 pt-3 border-t border-[var(--border)]">
              <a
                href="#"
                className="inline-flex items-center gap-1 text-xs text-[var(--primary)] hover:underline"
                aria-label="Open asset in Facilitron Inspection Tool"
              >
                <ExternalLink className="h-3 w-3" />
                Open in FIT
              </a>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
