/**
 * Warehouse transaction types shared between API and web app.
 * P1-26: Warehouse Transactions
 */

export type TransactionType = "issue" | "receive" | "adjust" | "transfer" | "return";

export type TransactionReferenceType = "work-order" | "purchase-order" | "transfer" | "manual";

export interface InventoryTransaction {
  id: number;
  customerID: number;
  transactionType: TransactionType;
  partId: number;
  partName: string;
  partSku: string;
  locationId: number;
  locationName: string;
  quantity: number; // positive for in, negative for out
  reference: string | null;
  referenceType: TransactionReferenceType | null;
  transactedBy: string;
  transactionDate: string; // ISO
  notes: string | null;
  runningBalance: number;
}

export interface CreateTransactionInput {
  transactionType: TransactionType;
  partId: number;
  locationId: number;
  quantity: number;
  reference?: string;
  referenceType?: TransactionReferenceType;
  notes?: string;
}

export interface ListTransactionsQuery {
  page?: number;
  limit?: number;
  transactionType?: TransactionType;
  partId?: number;
  locationId?: number;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface TransactionVolumeEntry {
  month: string;
  issues: number;
  receipts: number;
  adjustments: number;
  transfers: number;
  returns: number;
}

export interface TurnoverRateEntry {
  partId: number;
  partName: string;
  issuedQty: number;
  avgOnHand: number;
  turnoverRate: number;
}

export interface ShrinkageEntry {
  month: string;
  partId: number;
  partName: string;
  adjustedQty: number;
  estimatedLoss: number;
}

export interface WarehouseStats {
  totalTransactionsToday: number;
  issuesThisWeek: number;
  receiptsThisWeek: number;
  adjustmentsThisMonth: number;
  transactionVolume: TransactionVolumeEntry[];
  turnoverRates: TurnoverRateEntry[];
  shrinkageReport: ShrinkageEntry[];
}
