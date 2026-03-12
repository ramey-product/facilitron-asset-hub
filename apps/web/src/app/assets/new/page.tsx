"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCreateAsset } from "@/hooks/use-assets";

const conditionOptions = [
  { value: "excellent", label: "Excellent (5)" },
  { value: "good", label: "Good (4)" },
  { value: "fair", label: "Fair (3)" },
  { value: "poor", label: "Poor (2)" },
  { value: "critical", label: "Critical (1)" },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "maintenance", label: "Under Maintenance" },
  { value: "inactive", label: "Inactive" },
];

export default function NewAssetPage() {
  const router = useRouter();
  const createAsset = useCreateAsset();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    const formData = new FormData(e.currentTarget);
    const assetName = formData.get("assetName") as string;

    if (!assetName?.trim()) {
      setErrors({ assetName: "Asset name is required" });
      return;
    }

    const data: Record<string, unknown> = {
      assetName: assetName.trim(),
    };

    const optional = (key: string, formKey?: string) => {
      const val = formData.get(formKey ?? key) as string;
      if (val?.trim()) data[key] = val.trim();
    };

    const optionalNumber = (key: string, formKey?: string) => {
      const val = formData.get(formKey ?? key) as string;
      if (val?.trim()) data[key] = parseFloat(val);
    };

    optional("serialNumber");
    optional("modelNumber");
    optional("notes");
    optional("assetCondition");
    optional("assetStatus");
    optionalNumber("purchaseCost");

    const purchaseDate = formData.get("purchaseDate") as string;
    if (purchaseDate) data.purchaseDate = new Date(purchaseDate).toISOString();

    const warrantyExpiration = formData.get("warrantyExpiration") as string;
    if (warrantyExpiration)
      data.warrantyExpiration = new Date(warrantyExpiration).toISOString();

    try {
      await createAsset.mutateAsync(data);
      router.push("/assets");
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : "Failed to create asset",
      });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <Link href="/assets">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-3.5 w-3.5" />
                Back
              </Button>
            </Link>
            <h1 className="text-xl font-bold text-[var(--foreground)]">
              Add New Asset
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.form && (
            <div className="rounded-lg border border-[var(--destructive)]/30 bg-[var(--destructive)]/5 p-4 text-sm text-[var(--destructive)]">
              {errors.form}
            </div>
          )}

          {/* Basic Info */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Basic Information
              </h3>

              <FormField
                label="Asset Name"
                name="assetName"
                required
                error={errors.assetName}
                placeholder="e.g., HVAC System - Building A"
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Serial Number"
                  name="serialNumber"
                  placeholder="e.g., SN-12345"
                />
                <FormField
                  label="Model Number"
                  name="modelNumber"
                  placeholder="e.g., XC21-060"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Condition"
                  name="assetCondition"
                  options={conditionOptions}
                />
                <FormSelect
                  label="Status"
                  name="assetStatus"
                  options={statusOptions}
                  defaultValue="active"
                />
              </div>
            </CardContent>
          </Card>

          {/* Financial */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Financial & Warranty
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  label="Purchase Cost"
                  name="purchaseCost"
                  type="number"
                  placeholder="0.00"
                />
                <FormField
                  label="Purchase Date"
                  name="purchaseDate"
                  type="date"
                />
                <FormField
                  label="Warranty Expiration"
                  name="warrantyExpiration"
                  type="date"
                />
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Notes
              </h3>
              <div>
                <textarea
                  name="notes"
                  rows={4}
                  placeholder="Additional notes about this asset..."
                  className="w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3">
            <Link href="/assets">
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={createAsset.isPending}>
              <Save className="mr-2 h-3.5 w-3.5" />
              {createAsset.isPending ? "Creating..." : "Create Asset"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormField({
  label,
  name,
  type = "text",
  placeholder,
  required,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-medium text-[var(--muted-foreground)] mb-1"
      >
        {label}
        {required && <span className="text-[var(--destructive)]"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        step={type === "number" ? "0.01" : undefined}
        className={cn(
          "h-9 w-full rounded-lg border bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]",
          error
            ? "border-[var(--destructive)]"
            : "border-[var(--border)]"
        )}
      />
      {error && (
        <p className="mt-1 text-xs text-[var(--destructive)]">{error}</p>
      )}
    </div>
  );
}

function FormSelect({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-xs font-medium text-[var(--muted-foreground)] mb-1"
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        className="h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

