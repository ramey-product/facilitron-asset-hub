import type {
  StatusProvider,
  PaginatedResult,
} from "../../types/providers.js";
import type {
  OperationalStatus,
  StatusReason,
  StatusRecord,
  StatusHistoryEntry,
} from "@asset-hub/shared";
import { mockAssets } from "./data/assets.js";
import { mockStatusReasons } from "./data/status-reasons.js";
import { mockStatusHistory } from "./data/status-history.js";

// Deep copy of assets for in-memory mutations — never mutate shared seed data
const mutableAssets = mockAssets.map((a) => ({ ...a }));

// Working copy for in-memory mutations
const statusHistory = [...mockStatusHistory];
let nextHistoryId =
  Math.max(...statusHistory.map((h) => h.id), 0) + 1;

export const mockStatusProvider: StatusProvider = {
  async getStatus(
    customerID: number,
    assetId: number
  ): Promise<StatusRecord | null> {
    const asset = mutableAssets.find(
      (a) =>
        a.customerID === customerID &&
        a.equipmentRecordID === assetId &&
        a.isActive
    );
    if (!asset) return null;

    return {
      assetId: asset.equipmentRecordID,
      operationalStatus: asset.operationalStatus,
      statusReasonCode: asset.statusReasonCode,
      statusChangedAt: asset.statusChangedAt,
      statusChangedBy: asset.statusChangedBy,
    };
  },

  async updateStatus(
    customerID: number,
    assetId: number,
    status: OperationalStatus,
    reasonCode: string | null,
    notes: string | null,
    changedBy: number
  ): Promise<StatusRecord | null> {
    const idx = mutableAssets.findIndex(
      (a) =>
        a.customerID === customerID &&
        a.equipmentRecordID === assetId &&
        a.isActive
    );
    if (idx === -1) return null;

    const asset = mutableAssets[idx]!;
    const now = new Date().toISOString();
    const previousStatus = asset.operationalStatus;

    // Record history entry
    statusHistory.push({
      id: nextHistoryId++,
      assetId,
      previousStatus,
      newStatus: status,
      reasonCode,
      notes,
      changedBy,
      changedByName: "demo.user",
      changedAt: now,
    });

    // Update asset in-memory
    mutableAssets[idx] = {
      ...asset,
      operationalStatus: status,
      statusReasonCode: status === "offline" ? reasonCode : null,
      statusChangedAt: now,
      statusChangedBy: changedBy,
      dateModified: now,
      modifiedBy: changedBy,
    };

    return {
      assetId,
      operationalStatus: status,
      statusReasonCode: status === "offline" ? reasonCode : null,
      statusChangedAt: now,
      statusChangedBy: changedBy,
    };
  },

  async getHistory(
    customerID: number,
    assetId: number,
    page: number,
    limit: number
  ): Promise<PaginatedResult<StatusHistoryEntry>> {
    // Verify asset belongs to customer
    const asset = mutableAssets.find(
      (a) =>
        a.customerID === customerID && a.equipmentRecordID === assetId
    );
    if (!asset) {
      return {
        items: [],
        meta: { page, limit, total: 0, totalPages: 0 },
      };
    }

    const history = statusHistory
      .filter((h) => h.assetId === assetId)
      .sort(
        (a, b) =>
          new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
      );

    const total = history.length;
    const start = (page - 1) * limit;
    const items = history.slice(start, start + limit);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  getReasons(): StatusReason[] {
    return [...mockStatusReasons];
  },
};
