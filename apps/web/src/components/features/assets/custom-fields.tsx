"use client";

import { useState, useCallback } from "react";
import { Edit, Save, X, Settings2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useCustomFieldDefinitions,
  useAssetCustomFields,
  useUpdateCustomFields,
} from "@/hooks/use-custom-fields";
import type { CustomFieldDefinition, CustomFieldValue } from "@asset-hub/shared";

interface CustomFieldsProps {
  assetId: number;
  editable?: boolean;
}

export function CustomFields({ assetId, editable = true }: CustomFieldsProps) {
  const { data: defsData, isLoading: defsLoading } = useCustomFieldDefinitions();
  const { data: valuesData, isLoading: valuesLoading } = useAssetCustomFields(assetId);
  const updateMutation = useUpdateCustomFields(assetId);

  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<Record<number, string | number | boolean | null>>({});

  const definitions: CustomFieldDefinition[] = (defsData?.data ?? []).filter((d) => d.isActive);
  const values: CustomFieldValue[] = valuesData?.data ?? [];

  const getFieldValue = useCallback(
    (defId: number): string | number | boolean | null => {
      const match = values.find((v) => v.definitionId === defId);
      return match?.value ?? null;
    },
    [values]
  );

  const startEditing = () => {
    const initial: Record<number, string | number | boolean | null> = {};
    for (const def of definitions) {
      initial[def.id] = getFieldValue(def.id);
    }
    setEditValues(initial);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditValues({});
  };

  const saveChanges = () => {
    const payload = definitions.map((def) => ({
      definitionId: def.id,
      value: editValues[def.id] ?? null,
    }));
    updateMutation.mutate(
      { values: payload },
      {
        onSuccess: () => setIsEditing(false),
      }
    );
  };

  const updateFieldValue = (defId: number, value: string | number | boolean | null) => {
    setEditValues((prev) => ({ ...prev, [defId]: value }));
  };

  const isLoading = defsLoading || valuesLoading;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-12 animate-pulse rounded-lg bg-[var(--muted)]"
          />
        ))}
      </div>
    );
  }

  if (definitions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Settings2 className="mx-auto h-8 w-8 text-[var(--muted-foreground)]" />
          <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">
            No custom fields configured
          </h3>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Custom fields can be set up in Settings to capture organization-specific asset data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with edit toggle */}
      {editable && (
        <div className="flex items-center justify-end gap-2">
          {isEditing ? (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={cancelEditing}
                disabled={updateMutation.isPending}
              >
                <X className="mr-1 h-3.5 w-3.5" />
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={saveChanges}
                disabled={updateMutation.isPending}
              >
                <Save className="mr-1 h-3.5 w-3.5" />
                {updateMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={startEditing}>
              <Edit className="mr-1 h-3.5 w-3.5" />
              Edit Fields
            </Button>
          )}
        </div>
      )}

      {/* Fields Grid */}
      <Card>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {definitions
              .sort((a, b) => a.displayOrder - b.displayOrder)
              .map((def) => (
                <div key={def.id}>
                  {isEditing ? (
                    <FieldInput
                      definition={def}
                      value={editValues[def.id] ?? null}
                      onChange={(v) => updateFieldValue(def.id, v)}
                    />
                  ) : (
                    <FieldDisplay
                      definition={def}
                      value={getFieldValue(def.id)}
                    />
                  )}
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Field Display (View Mode) ----

function FieldDisplay({
  definition,
  value,
}: {
  definition: CustomFieldDefinition;
  value: string | number | boolean | null;
}) {
  let displayValue: string;
  if (value === null || value === undefined || value === "") {
    displayValue = "\u2014"; // em dash
  } else if (typeof value === "boolean") {
    displayValue = value ? "Yes" : "No";
  } else if (definition.fieldType === "date" && typeof value === "string") {
    try {
      displayValue = new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      displayValue = String(value);
    }
  } else {
    displayValue = String(value);
  }

  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
        {definition.fieldLabel}
        {definition.isRequired && (
          <span className="ml-1 text-[var(--destructive)]">*</span>
        )}
      </div>
      <div className="mt-0.5 text-sm text-[var(--foreground)]">{displayValue}</div>
    </div>
  );
}

// ---- Field Input (Edit Mode) ----

function FieldInput({
  definition,
  value,
  onChange,
}: {
  definition: CustomFieldDefinition;
  value: string | number | boolean | null;
  onChange: (value: string | number | boolean | null) => void;
}) {
  const labelId = `custom-field-${definition.id}`;
  const baseInputClasses =
    "h-9 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]";

  return (
    <div>
      <label
        htmlFor={labelId}
        className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]"
      >
        {definition.fieldLabel}
        {definition.isRequired && (
          <span className="ml-1 text-[var(--destructive)]">*</span>
        )}
      </label>
      <div className="mt-1">
        {definition.fieldType === "text" && (
          <input
            id={labelId}
            type="text"
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value || null)}
            className={baseInputClasses}
            required={definition.isRequired}
          />
        )}

        {definition.fieldType === "number" && (
          <input
            id={labelId}
            type="number"
            value={typeof value === "number" ? value : ""}
            onChange={(e) =>
              onChange(e.target.value ? parseFloat(e.target.value) : null)
            }
            className={baseInputClasses}
            required={definition.isRequired}
          />
        )}

        {definition.fieldType === "date" && (
          <input
            id={labelId}
            type="date"
            value={typeof value === "string" ? value.slice(0, 10) : ""}
            onChange={(e) => onChange(e.target.value || null)}
            className={baseInputClasses}
            required={definition.isRequired}
          />
        )}

        {definition.fieldType === "select" && (
          <select
            id={labelId}
            value={typeof value === "string" ? value : ""}
            onChange={(e) => onChange(e.target.value || null)}
            className={cn(baseInputClasses, "appearance-none")}
            required={definition.isRequired}
          >
            <option value="">Select...</option>
            {(definition.options ?? []).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}

        {definition.fieldType === "boolean" && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              id={labelId}
              type="checkbox"
              checked={value === true}
              onChange={(e) => onChange(e.target.checked)}
              className="h-4 w-4 rounded border border-[var(--border)] text-[var(--primary)] focus:ring-[var(--ring)]"
            />
            <span className="text-sm text-[var(--foreground)]">
              {value === true ? "Yes" : "No"}
            </span>
          </label>
        )}
      </div>
    </div>
  );
}
