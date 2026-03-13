"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UploadStep } from "./UploadStep";
import { MappingStep } from "./MappingStep";
import { ValidationStep } from "./ValidationStep";
import { ConfirmStep } from "./ConfirmStep";
import { ResultsStep } from "./ResultsStep";
import type { ImportColumnMapping, ImportValidationResult, ImportResult } from "@asset-hub/shared/types/import.js";

const STEPS = [
  { number: 1, label: "Upload" },
  { number: 2, label: "Map" },
  { number: 3, label: "Validate" },
  { number: 4, label: "Confirm" },
  { number: 5, label: "Results" },
] as const;

export interface ParsedFile {
  filename: string;
  size: number;
  headers: string[];
  rows: Record<string, unknown>[];
}

export function ImportWizard() {
  const [step, setStep] = useState(1);
  const [parsedFile, setParsedFile] = useState<ParsedFile | null>(null);
  const [mappings, setMappings] = useState<ImportColumnMapping[]>([]);
  const [validationResult, setValidationResult] = useState<ImportValidationResult | null>(null);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const goNext = useCallback(() => setStep((s) => Math.min(s + 1, 5)), []);
  const goBack = useCallback(() => setStep((s) => Math.max(s - 1, 1)), []);

  const handleFileUploaded = useCallback(
    (file: ParsedFile) => {
      setParsedFile(file);
      goNext();
    },
    [goNext]
  );

  const handleMappingsConfirmed = useCallback(
    (m: ImportColumnMapping[]) => {
      setMappings(m);
      goNext();
    },
    [goNext]
  );

  const handleValidated = useCallback(
    (result: ImportValidationResult) => {
      setValidationResult(result);
      goNext();
    },
    [goNext]
  );

  const handleImportComplete = useCallback(
    (result: ImportResult) => {
      setImportResult(result);
      goNext();
    },
    [goNext]
  );

  const handleReset = useCallback(() => {
    setStep(1);
    setParsedFile(null);
    setMappings([]);
    setValidationResult(null);
    setImportResult(null);
  }, []);

  // Build the flat mappings record for API calls
  const mappingsRecord = mappings.reduce<Record<string, string>>((acc, m) => {
    if (m.targetField) {
      acc[m.sourceColumn] = m.targetField;
    }
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Progress bar */}
      <nav aria-label="Import wizard progress" className="px-4">
        <ol className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const isCompleted = step > s.number;
            const isCurrent = step === s.number;
            return (
              <li
                key={s.number}
                className={cn("flex items-center", i < STEPS.length - 1 && "flex-1")}
              >
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors",
                      isCompleted
                        ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : isCurrent
                        ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                        : "border-[var(--border)] bg-[var(--muted)] text-[var(--muted-foreground)]"
                    )}
                    aria-current={isCurrent ? "step" : undefined}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : s.number}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium hidden sm:block",
                      isCurrent
                        ? "text-[var(--primary)]"
                        : isCompleted
                        ? "text-[var(--foreground)]"
                        : "text-[var(--muted-foreground)]"
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "mx-3 h-0.5 flex-1 rounded-full transition-colors",
                      step > s.number
                        ? "bg-[var(--primary)]"
                        : "bg-[var(--border)]"
                    )}
                    aria-hidden="true"
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Step content */}
      <div className="min-h-[400px]">
        {step === 1 && <UploadStep onFileUploaded={handleFileUploaded} />}
        {step === 2 && parsedFile && (
          <MappingStep
            headers={parsedFile.headers}
            sampleRows={parsedFile.rows.slice(0, 3)}
            onConfirm={handleMappingsConfirmed}
            onBack={goBack}
          />
        )}
        {step === 3 && parsedFile && (
          <ValidationStep
            parsedFile={parsedFile}
            mappings={mappingsRecord}
            onValidated={handleValidated}
            onBack={goBack}
          />
        )}
        {step === 4 && validationResult && parsedFile && (
          <ConfirmStep
            validationResult={validationResult}
            parsedFile={parsedFile}
            mappings={mappingsRecord}
            onExecute={handleImportComplete}
            onBack={goBack}
          />
        )}
        {step === 5 && importResult && (
          <ResultsStep result={importResult} onReset={handleReset} />
        )}
      </div>

      {/* Back button for steps 2-4 (handled inline in each step for consistency) */}
    </div>
  );
}
