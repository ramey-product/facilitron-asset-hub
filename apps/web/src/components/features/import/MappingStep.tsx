"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Sparkles, AlertCircle, ChevronDown } from "lucide-react";
import {
  IMPORTABLE_FIELDS,
  type ImportColumnMapping,
  type ImportFieldDefinition,
} from "@asset-hub/shared";

interface MappingStepProps {
  headers: string[];
  sampleRows: Record<string, unknown>[];
  onConfirm: (mappings: ImportColumnMapping[]) => void;
  onBack: () => void;
}

/**
 * Levenshtein distance for auto-matching column names to known field aliases.
 */
function levenshtein(a: string, b: string): number {
  const an = a.length;
  const bn = b.length;
  const matrix: number[][] = [];
  for (let i = 0; i <= an; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= bn; j++) {
    matrix[0]![j] = j;
  }
  for (let i = 1; i <= an; i++) {
    for (let j = 1; j <= bn; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i]![j] = Math.min(
        matrix[i - 1]![j]! + 1,
        matrix[i]![j - 1]! + 1,
        matrix[i - 1]![j - 1]! + cost
      );
    }
  }
  return matrix[an]![bn]!;
}

function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
}

function computeAutoMappings(headers: string[]): ImportColumnMapping[] {
  return headers.map((header) => {
    const normalized = normalizeHeader(header);
    let bestField: ImportFieldDefinition | null = null;
    let bestScore = 0;

    for (const fieldDef of IMPORTABLE_FIELDS) {
      // Check exact alias match first
      for (const alias of fieldDef.aliases) {
        if (normalized === alias.toLowerCase()) {
          return { sourceColumn: header, targetField: fieldDef.field, confidence: 1.0 };
        }
      }
      // Check contains match
      for (const alias of fieldDef.aliases) {
        const aliasNorm = alias.toLowerCase();
        if (normalized.includes(aliasNorm) || aliasNorm.includes(normalized)) {
          const maxLen = Math.max(normalized.length, aliasNorm.length);
          const containScore = Math.min(normalized.length, aliasNorm.length) / maxLen;
          if (containScore > bestScore) {
            bestScore = containScore;
            bestField = fieldDef;
          }
        }
      }
      // Levenshtein fallback
      for (const alias of fieldDef.aliases) {
        const aliasNorm = alias.toLowerCase();
        const maxLen = Math.max(normalized.length, aliasNorm.length);
        if (maxLen === 0) continue;
        const dist = levenshtein(normalized, aliasNorm);
        const similarity = 1 - dist / maxLen;
        if (similarity > bestScore && similarity >= 0.5) {
          bestScore = similarity;
          bestField = fieldDef;
        }
      }
    }

    return {
      sourceColumn: header,
      targetField: bestField?.field ?? "",
      confidence: bestField ? Math.round(bestScore * 100) / 100 : 0,
    };
  });
}

function MappingDropdown({
  mapping,
  sampleValues,
  usedTargets,
  onChangeTarget,
}: {
  mapping: ImportColumnMapping;
  sampleValues: string[];
  usedTargets: Set<string>;
  onChangeTarget: (targetField: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const targetDef = IMPORTABLE_FIELDS.find((f) => f.field === mapping.targetField);
  const isAutoDetected = mapping.confidence >= 0.7 && mapping.targetField !== "";
  const isRequired =
    targetDef?.required ?? false;
  const unmappedRequired = IMPORTABLE_FIELDS.filter(
    (f) => f.required && !usedTargets.has(f.field)
  );

  return (
    <Card className={cn(
      "transition-all",
      !mapping.targetField && "border-[var(--destructive)]/30"
    )}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
          {/* Source column info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[var(--foreground)] truncate">
                {mapping.sourceColumn}
              </span>
              {isAutoDetected && (
                <Badge className="bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20 text-[10px] shrink-0">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Auto-detected {Math.round(mapping.confidence * 100)}%
                </Badge>
              )}
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {sampleValues.slice(0, 3).map((val, i) => (
                <span
                  key={i}
                  className="inline-block max-w-[200px] truncate rounded bg-[var(--muted)] px-2 py-0.5 text-xs text-[var(--muted-foreground)]"
                >
                  {String(val) || "(empty)"}
                </span>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden sm:flex items-center pt-2">
            <ArrowRight className="h-4 w-4 text-[var(--muted-foreground)]" />
          </div>

          {/* Target field dropdown */}
          <div className="relative sm:w-56 shrink-0">
            <button
              onClick={() => setOpen(!open)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors",
                mapping.targetField
                  ? "border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                  : "border-[var(--destructive)]/40 bg-[var(--destructive)]/5 text-[var(--muted-foreground)]"
              )}
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-label={`Map ${mapping.sourceColumn} to asset field`}
            >
              <span className="truncate">
                {targetDef ? targetDef.label : "-- Select field --"}
              </span>
              <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")} />
            </button>
            {open && (
              <div
                className="absolute right-0 top-full z-20 mt-1 max-h-64 w-64 overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-lg"
                role="listbox"
                aria-label="Select target field"
              >
                {/* Skip / unmap option */}
                <button
                  onClick={() => {
                    onChangeTarget("");
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center px-3 py-2 text-sm text-left hover:bg-[var(--muted)]/50 transition-colors",
                    mapping.targetField === "" && "bg-[var(--muted)]/50"
                  )}
                  role="option"
                  aria-selected={mapping.targetField === ""}
                >
                  <span className="text-[var(--muted-foreground)] italic">-- Skip this column --</span>
                </button>
                <div className="mx-2 border-t border-[var(--border)]" />
                {IMPORTABLE_FIELDS.map((fieldDef) => {
                  const isUsed =
                    usedTargets.has(fieldDef.field) && mapping.targetField !== fieldDef.field;
                  return (
                    <button
                      key={fieldDef.field}
                      onClick={() => {
                        if (!isUsed) {
                          onChangeTarget(fieldDef.field);
                          setOpen(false);
                        }
                      }}
                      disabled={isUsed}
                      className={cn(
                        "flex w-full items-center justify-between px-3 py-2 text-sm text-left transition-colors",
                        isUsed
                          ? "opacity-40 cursor-not-allowed"
                          : "hover:bg-[var(--muted)]/50",
                        mapping.targetField === fieldDef.field && "bg-[var(--primary)]/10"
                      )}
                      role="option"
                      aria-selected={mapping.targetField === fieldDef.field}
                      aria-disabled={isUsed}
                    >
                      <span className={cn(
                        "truncate",
                        fieldDef.required ? "font-medium text-[var(--foreground)]" : "text-[var(--foreground)]"
                      )}>
                        {fieldDef.label}
                        {fieldDef.required && <span className="text-[var(--destructive)] ml-1">*</span>}
                      </span>
                      {isUsed && (
                        <span className="text-[10px] text-[var(--muted-foreground)]">in use</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function MappingStep({ headers, sampleRows, onConfirm, onBack }: MappingStepProps) {
  const [mappings, setMappings] = useState<ImportColumnMapping[]>(() =>
    computeAutoMappings(headers)
  );

  const usedTargets = useMemo(() => {
    const used = new Set<string>();
    for (const m of mappings) {
      if (m.targetField) used.add(m.targetField);
    }
    return used;
  }, [mappings]);

  const requiredFields = IMPORTABLE_FIELDS.filter((f) => f.required);
  const unmappedRequired = requiredFields.filter((f) => !usedTargets.has(f.field));
  const canProceed = unmappedRequired.length === 0;

  const handleChangeTarget = (sourceColumn: string, targetField: string) => {
    setMappings((prev) =>
      prev.map((m) =>
        m.sourceColumn === sourceColumn
          ? { ...m, targetField, confidence: targetField ? 1.0 : 0 }
          : m
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-[var(--foreground)]">Map Columns</h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          Match your file columns to asset fields. Required fields are marked with a red asterisk.
        </p>
      </div>

      {/* Required fields warning */}
      {unmappedRequired.length > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-500" />
          <div>
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
              Required fields not mapped
            </p>
            <p className="text-sm text-[var(--muted-foreground)]">
              {unmappedRequired.map((f) => f.label).join(", ")} must be mapped to proceed.
            </p>
          </div>
        </div>
      )}

      {/* Mapping cards */}
      <div className="space-y-3">
        {mappings.map((mapping) => {
          const sampleValues = sampleRows.map((row) =>
            String(row[mapping.sourceColumn] ?? "")
          );
          return (
            <MappingDropdown
              key={mapping.sourceColumn}
              mapping={mapping}
              sampleValues={sampleValues}
              usedTargets={usedTargets}
              onChangeTarget={(target) => handleChangeTarget(mapping.sourceColumn, target)}
            />
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={() => onConfirm(mappings.filter((m) => m.targetField !== ""))}
          disabled={!canProceed}
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
