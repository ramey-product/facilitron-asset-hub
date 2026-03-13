/**
 * Consumption & audit types shared between API and web app.
 * P1-19: WO Consumption Auto-Decrement
 */

export interface ConsumptionRecord {
  id: number;
  customerID: number;
  workOrderId: number;
  workOrderNumber: string;
  partId: number;
  partName: string;
  partSku: string;
  locationId: number;
  locationName: string;
  qty: number;
  unitCost: number;
  totalCost: number;
  loggedBy: string;
  loggedAt: string;
  isReversed: boolean;
  reversedBy: string | null;
  reversedAt: string | null;
}

export interface ConsumptionForecast {
  partId: number;
  partName: string;
  currentStock: number;
  avgDailyConsumption: number;
  daysUntilStockout: number | null; // null if no consumption history
  stockoutStatus: "safe" | "caution" | "urgent";
  historyWindow: number; // days used for calculation
}

export interface InventoryAuditRecord {
  id: number;
  customerID: number;
  partId: number;
  partName: string;
  locationId: number;
  locationName: string;
  changeType:
    | "consumption"
    | "adjustment"
    | "reversal"
    | "receiving"
    | "transfer";
  qtyBefore: number;
  qtyAfter: number;
  qtyChanged: number;
  reason: string;
  referenceId: string | null; // WO number, PO number, etc.
  changedBy: string;
  changedAt: string;
}

export interface ListConsumptionQuery {
  page: number;
  limit: number;
  partId?: number;
  workOrderId?: number;
  locationId?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface ListAuditQuery {
  page: number;
  limit: number;
  partId?: number;
  locationId?: number;
  changeType?: InventoryAuditRecord["changeType"];
  dateFrom?: string;
  dateTo?: string;
}
