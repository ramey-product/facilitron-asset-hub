"use client";

import { useState } from "react";
import { Wifi, WifiOff, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAssetStatus, useStatusReasons, useUpdateStatus } from "@/hooks/use-status";

interface StatusToggleProps {
  assetId: number;
}

export function StatusToggle({ assetId }: StatusToggleProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [notes, setNotes] = useState("");

  const { data: statusData } = useAssetStatus(assetId);
  const { data: reasonsData } = useStatusReasons();
  const updateStatus = useUpdateStatus();

  const status = statusData?.data;
  const reasons = reasonsData?.data ?? [];
  const isOnline = status?.isOnline ?? true;

  const handleToggle = () => {
    if (isOnline) {
      // Going offline — need reason
      setIsModalOpen(true);
    } else {
      // Going online — no reason needed
      updateStatus.mutate({ assetId, isOnline: true });
    }
  };

  const handleOfflineSubmit = () => {
    updateStatus.mutate({
      assetId,
      isOnline: false,
      reasonCode: selectedReason || undefined,
      notes: notes || undefined,
    });
    setIsModalOpen(false);
    setSelectedReason("");
    setNotes("");
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Status badge */}
        <Badge
          className={cn(
            "border text-[10px]",
            isOnline
              ? "border-emerald-300 bg-emerald-100 text-emerald-900 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "border-red-300 bg-red-100 text-red-900 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
          )}
          title={status?.reasonLabel ? `Reason: ${status.reasonLabel}` : undefined}
        >
          {isOnline ? (
            <Wifi className="mr-1 h-2.5 w-2.5" />
          ) : (
            <WifiOff className="mr-1 h-2.5 w-2.5" />
          )}
          {isOnline ? "Online" : "Offline"}
          {!isOnline && status?.reasonLabel && (
            <span className="ml-1 opacity-70">· {status.reasonLabel}</span>
          )}
        </Badge>

        {/* Toggle button */}
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={handleToggle}
          disabled={updateStatus.isPending}
        >
          <ChevronDown className="h-3 w-3" />
          {isOnline ? "Set Offline" : "Set Online"}
        </Button>
      </div>

      {/* Offline Reason Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}
        >
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                Mark Asset Offline
              </h3>
              <p className="text-sm text-[var(--muted-foreground)]">
                Provide a reason for taking this asset offline.
              </p>

              <div>
                <label className="text-xs font-medium text-[var(--foreground)]">
                  Reason <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                >
                  <option value="">Select a reason...</option>
                  {reasons.map((r) => (
                    <option key={r.code} value={r.code}>
                      {r.label}
                    </option>
                  ))}
                  {reasons.length === 0 && (
                    <>
                      <option value="maintenance">Under Maintenance</option>
                      <option value="repair">Awaiting Repair</option>
                      <option value="inspection">Under Inspection</option>
                      <option value="decommission">Pending Decommission</option>
                      <option value="other">Other</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--foreground)]">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Additional details..."
                  className="mt-1 w-full rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--ring)]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-red-600 text-white hover:bg-red-700"
                  onClick={handleOfflineSubmit}
                  disabled={!selectedReason || updateStatus.isPending}
                >
                  Mark Offline
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
