/**
 * Inventory entity types shared between API and web app.
 * P1-17: Parts Catalog + P1-18: Multi-Location Stock
 */

// ---- P1-17: Parts Catalog ----

export interface PartRecord {
  id: number;
  customerID: number;
  sku: string;
  name: string;
  description: string | null;
  categoryId: number;
  categoryName: string;
  unitCost: number;
  unitOfMeasure: string;
  vendorId: number | null;
  vendorName: string | null;
  minQty: number;
  maxQty: number;
  reorderPoint: number;
  storageLocation: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PartCategory {
  id: number;
  customerID: number;
  name: string;
  parentId: number | null;
  partCount: number;
}

export interface ListPartsQuery {
  page: number;
  limit: number;
  search?: string;
  categoryId?: number;
  vendorId?: number;
  status?: "active" | "inactive" | "all";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreatePartInput {
  sku: string;
  name: string;
  description?: string;
  categoryId: number;
  unitCost?: number;
  unitOfMeasure?: string;
  vendorId?: number;
  minQty?: number;
  maxQty?: number;
  reorderPoint?: number;
  storageLocation?: string;
  imageUrl?: string;
}

export type UpdatePartInput = Partial<CreatePartInput>;

// ---- P1-18: Multi-Location Stock ----

export interface StockLevel {
  id: number;
  partId: number;
  locationId: number;
  locationName: string;
  qtyOnHand: number;
  qtyReserved: number;
  available: number; // computed: onHand - reserved
  lastCountDate: string | null;
  lastCountBy: string | null;
}

export interface StockAdjustInput {
  qtyOnHand?: number;
  qtyReserved?: number;
  reason: string;
  notes?: string;
}

export interface StockRollup {
  partId: number;
  partName: string;
  sku: string;
  totalOnHand: number;
  totalReserved: number;
  totalAvailable: number;
  locationCount: number;
  minLocationQty: number;
  maxLocationQty: number;
  reorderPoint: number;
  stockStatus: "in-stock" | "low-stock" | "out-of-stock";
}

export interface StockAlert {
  partId: number;
  partName: string;
  sku: string;
  reorderPoint: number;
  totalOnHand: number;
  deficit: number;
  severity: "warning" | "critical";
}

export interface StockAdjustmentLog {
  id: number;
  partId: number;
  locationId: number;
  locationName: string;
  previousQtyOnHand: number;
  newQtyOnHand: number;
  previousQtyReserved: number;
  newQtyReserved: number;
  reason: string;
  notes: string | null;
  adjustedBy: number;
  adjustedAt: string;
}
