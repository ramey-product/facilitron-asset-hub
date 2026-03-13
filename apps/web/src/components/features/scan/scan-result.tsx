"use client";

import { useRouter } from "next/navigation";
import {
  Eye,
  Wrench,
  Activity,
  ArrowRightLeft,
  X,
  Box,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, getConditionBg } from "@/lib/utils";
import { useAsset, conditionLabel } from "@/hooks/use-assets";

interface ScanResultProps {
  scannedCode: string;
  assetId: number | null;
  onDismiss: () => void;
}

export function ScanResult({ scannedCode, assetId, onDismiss }: ScanResultProps) {
  const router = useRouter();
  const { data: assetData, isLoading } = useAsset(assetId ?? 0);
  const asset = assetData?.data;

  const actions = [
    {
      label: "View Details",
      icon: Eye,
      onClick: () => assetId && router.push(`/assets/${assetId}`),
      primary: true,
    },
    {
      label: "Create Work Order",
      icon: Wrench,
      onClick: () => {
        // Placeholder: navigate to WO creation with asset pre-filled
      },
      primary: false,
    },
    {
      label: "Log Condition",
      icon: Activity,
      onClick: () => assetId && router.push(`/assets/${assetId}?tab=overview`),
      primary: false,
    },
    {
      label: "Check In/Out",
      icon: ArrowRightLeft,
      onClick: () => {
        // Placeholder: toggle check-in/out status
      },
      primary: false,
    },
  ];

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300"
      role="dialog"
      aria-label="Scan result"
      aria-modal="true"
    >
      <div className="mx-auto max-w-lg">
        <Card className="rounded-b-none border-b-0 shadow-2xl">
          <CardContent className="p-5">
            {/* Handle bar */}
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-[var(--muted)]" />

            {/* Dismiss */}
            <button
              onClick={onDismiss}
              className="absolute right-4 top-4 rounded-full p-1 text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
              aria-label="Dismiss scan result"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Scanned Code */}
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-wider text-[var(--muted-foreground)]">
                Scanned Code
              </p>
              <p className="font-mono text-sm text-[var(--foreground)]">
                {scannedCode}
              </p>
            </div>

            {/* Asset Info */}
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-5 w-48 animate-pulse rounded bg-[var(--muted)]" />
                <div className="h-4 w-32 animate-pulse rounded bg-[var(--muted)]" />
              </div>
            ) : asset ? (
              <div className="mb-4 flex items-start gap-3 rounded-lg border border-[var(--border)] p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10">
                  <Box className="h-5 w-5 text-[var(--primary)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-[var(--foreground)]">
                      {asset.equipmentName}
                    </h3>
                    <Badge
                      className={cn(
                        "text-[10px] border shrink-0",
                        getConditionBg(conditionLabel(asset.conditionRating))
                      )}
                    >
                      {conditionLabel(asset.conditionRating)}
                    </Badge>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
                    <MapPin className="h-3 w-3" />
                    {asset.propertyName ?? "Unknown location"}
                    {asset.locationName && ` - ${asset.locationName}`}
                  </div>
                  {asset.categoryName && (
                    <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                      {asset.categoryName}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="mb-4 rounded-lg border border-[var(--destructive)]/20 bg-[var(--destructive)]/5 p-3">
                <p className="text-sm text-[var(--destructive)]">
                  No asset found for this code.
                </p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              {actions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    disabled={!asset}
                    className={cn(
                      "flex items-center gap-2 rounded-lg p-3 text-sm font-medium transition-colors min-h-[44px]",
                      action.primary
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90"
                        : "border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--muted)]",
                      !asset && "opacity-50 cursor-not-allowed"
                    )}
                    aria-label={action.label}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {action.label}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
