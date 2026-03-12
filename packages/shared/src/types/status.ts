/**
 * Online/Offline status types shared between API and web app.
 */

export type OperationalStatus = "online" | "offline";

export interface StatusReason {
  code: string;
  label: string;
  description: string;
  requiresNotes: boolean;
}

export interface StatusChangeInput {
  status: OperationalStatus;
  reasonCode: string | null;
  notes: string | null;
}

export interface StatusRecord {
  assetId: number;
  operationalStatus: OperationalStatus;
  statusReasonCode: string | null;
  statusChangedAt: string | null;
  statusChangedBy: number | null;
}

export interface StatusHistoryEntry {
  id: number;
  assetId: number;
  previousStatus: OperationalStatus;
  newStatus: OperationalStatus;
  reasonCode: string | null;
  notes: string | null;
  changedBy: number;
  changedByName: string;
  changedAt: string;
}
