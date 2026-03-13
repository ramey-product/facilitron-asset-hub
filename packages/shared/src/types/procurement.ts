/**
 * Procurement entity types shared between API and web app.
 * P1-21: Purchase Orders + P1-23: PO Receiving
 */

// ---- P1-21: Purchase Orders ----

export type PurchaseOrderStatus =
  | "Draft"
  | "Submitted"
  | "Approved"
  | "Ordered"
  | "PartiallyReceived"
  | "Received"
  | "Cancelled";

export interface PurchaseOrderLineItem {
  id: number;
  poId: number;
  partId: number;
  partNumber: string | null;
  partName: string | null;
  quantity: number;
  unitCost: number;
  lineTotal: number;
  taxRate: number;
  taxAmount: number;
  quantityReceived: number;
  notes: string | null;
}

export interface PurchaseOrder {
  id: number;
  poNumber: string; // "PO-{year}-{seq}" e.g. "PO-2026-0001"
  vendorId: number;
  vendorName: string | null; // joined
  status: PurchaseOrderStatus;
  createdBy: number;
  createdByName: string | null; // joined
  approvedBy: number | null;
  approvedByName: string | null;
  totalAmount: number;
  taxAmount: number;
  grandTotal: number;
  notes: string | null;
  propertyId: number;
  propertyName: string | null;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  approvedAt: string | null;
  orderedAt: string | null;
  receivedAt: string | null;
  cancelledAt: string | null;
  lineItems: PurchaseOrderLineItem[];
}

export interface CreatePurchaseOrderInput {
  vendorId: number;
  propertyId: number;
  notes?: string;
  lineItems: {
    partId: number;
    quantity: number;
    unitCost: number;
    taxRate?: number;
    notes?: string;
  }[];
}

export interface UpdatePurchaseOrderInput {
  vendorId?: number;
  notes?: string;
  lineItems?: {
    partId: number;
    quantity: number;
    unitCost: number;
    taxRate?: number;
    notes?: string;
  }[];
}

export interface ListPurchaseOrdersQuery {
  page?: number;
  limit?: number;
  status?: PurchaseOrderStatus;
  vendorId?: number;
  search?: string;
  sortBy?: "poNumber" | "createdAt" | "totalAmount" | "status";
  sortOrder?: "asc" | "desc";
}

// ---- P1-23: Receiving ----

export interface ReceivingLineItem {
  id: number;
  receivingId: number;
  poLineItemId: number;
  partId: number;
  partName: string | null;
  partNumber: string | null;
  quantityReceived: number;
  quantityRejected: number;
  rejectionReason: string | null;
  locationId: number;
  locationName: string | null;
}

export interface ReceivingRecord {
  id: number;
  poId: number;
  poNumber: string | null;
  receivedBy: number;
  receivedByName: string | null;
  receivedAt: string;
  notes: string | null;
  lineItems: ReceivingLineItem[];
}

export interface CreateReceivingInput {
  poId: number;
  notes?: string;
  lineItems: {
    poLineItemId: number;
    quantityReceived: number;
    quantityRejected?: number;
    rejectionReason?: string;
    locationId: number;
  }[];
}

export interface ListReceivingQuery {
  page?: number;
  limit?: number;
  poId?: number;
  search?: string;
}

// ---- Spend Analytics ----

export interface SpendByVendor {
  vendorId: number;
  vendorName: string;
  totalSpend: number;
  orderCount: number;
}

export interface SpendByCategory {
  categoryId: number;
  categoryName: string;
  totalSpend: number;
  partCount: number;
}

export interface MonthlySpend {
  month: string; // "YYYY-MM"
  totalSpend: number;
  orderCount: number;
}

export interface SpendAnalytics {
  byVendor: SpendByVendor[];
  byCategory: SpendByCategory[];
  monthly: MonthlySpend[];
  totalSpend: number;
  avgOrderValue: number;
  openOrders: number;
}
