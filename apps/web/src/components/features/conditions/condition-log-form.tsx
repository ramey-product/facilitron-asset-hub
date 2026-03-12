"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLogCondition } from "@/hooks/use-conditions";
import { Plus, X } from "lucide-react";

interface ConditionLogFormProps {
  assetId: number;
}

const scoreOptions = [
  { score: 5, label: "Excellent", color: "bg-emerald-500" },
  { score: 4, label: "Good", color: "bg-green-500" },
  { score: 3, label: "Fair", color: "bg-amber-500" },
  { score: 2, label: "Poor", color: "bg-orange-500" },
  { score: 1, label: "Critical", color: "bg-red-500" },
];

const sourceOptions = [
  { value: "manual", label: "Manual Assessment" },
  { value: "inspection", label: "Inspection" },
  { value: "work_order", label: "Work Order" },
];

export function ConditionLogForm({ assetId }: ConditionLogFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [source, setSource] = useState("manual");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState<string | null>(null);
  const logCondition = useLogCondition();

  const handleSubmit = async () => {
    if (selectedScore === null) return;
    setError(null);

    try {
      await logCondition.mutateAsync({
        assetId,
        data: {
          conditionScore: selectedScore,
          source,
          notes: notes.trim() || undefined,
        },
      });
      // Reset form
      setSelectedScore(null);
      setSource("manual");
      setNotes("");
      setIsOpen(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save condition assessment"
      );
    }
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="w-full"
      >
        <Plus className="mr-2 h-3.5 w-3.5" />
        Log Condition Assessment
      </Button>
    );
  }

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            New Condition Assessment
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Score Selection */}
        <div>
          <label className="block text-xs font-medium text-[var(--muted-foreground)] mb-2">
            Condition Score
          </label>
          <div className="flex gap-2">
            {scoreOptions.map((opt) => (
              <button
                key={opt.score}
                onClick={() => setSelectedScore(opt.score)}
                className={cn(
                  "flex-1 rounded-lg border p-2 text-center transition-all",
                  selectedScore === opt.score
                    ? "border-[var(--primary)] bg-[var(--primary)]/5 ring-1 ring-[var(--primary)]"
                    : "border-[var(--border)] hover:border-[var(--primary)]/50"
                )}
              >
                <div className={cn("mx-auto h-3 w-3 rounded-full mb-1", opt.color)} />
                <div className="text-xs font-medium text-[var(--foreground)]">
                  {opt.score}
                </div>
                <div className="text-[10px] text-[var(--muted-foreground)]">
                  {opt.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Source */}
        <div>
          <label
            htmlFor="condition-source"
            className="block text-xs font-medium text-[var(--muted-foreground)] mb-1"
          >
            Source
          </label>
          <select
            id="condition-source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
          >
            {sourceOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label
            htmlFor="condition-notes"
            className="block text-xs font-medium text-[var(--muted-foreground)] mb-1"
          >
            Notes (optional)
          </label>
          <textarea
            id="condition-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Describe the condition assessment..."
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
          />
        </div>

        {/* Error display */}
        {error && (
          <div className="rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/5 p-3 text-xs text-[var(--destructive)]">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={selectedScore === null || logCondition.isPending}
            className="flex-1"
          >
            {logCondition.isPending ? "Saving..." : "Save Assessment"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
