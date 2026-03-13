/**
 * Asset entity types shared between API and web app.
 * Column names mirror tblEquipment SQL Server schema (Drizzle ORM mapping).
 */

// ---- Legacy stubs (kept for backward compat if needed) ----

export type AssetStatus = "active" | "inactive" | "disposed" | "maintenance";

export type AssetCondition = "excellent" | "good" | "fair" | "poor" | "critical";

// ---- Canonical AssetRecord (used by API providers and frontend) ----

export interface AssetRecord {
  equipmentRecordID: number;
  customerID: number;
  propertyID: number | null;
  assetLocationID: number | null;
  equipmentName: string;
  equipmentDescription: string | null;
  equipmentTypeID: number | null;
  serialNumber: string | null;
  equipmentBarCodeID: string | null;
  manufacturerRecordID: number | null;
  modelNumber: string | null;
  acquisitionDate: string | null;
  acquisitionCost: number | null;
  warrantyExpiration: string | null;
  expectedLifeYears: number | null;
  lifecycleStatus: string;
  conditionRating: number | null;
  lastConditionDate: string | null;
  isActive: boolean;
  dateCreated: string;
  dateModified: string | null;
  createdBy: number | null;
  modifiedBy: number | null;
  notes: string | null;
  // Phase 3: Hierarchy support
  parentEquipmentId: number | null;
  // Phase 3: Online/Offline status
  operationalStatus: "online" | "offline";
  statusReasonCode: string | null;
  statusChangedAt: string | null;
  statusChangedBy: number | null;
  // Joined fields for list display
  propertyName: string | null;
  locationName: string | null;
  categorySlug: string | null;
  categoryName: string | null;
  manufacturerName: string | null;
  equipmentTypeName: string | null;
}

export interface ListAssetsQuery {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  condition?: string;
  categoryID?: number;
  propertyID?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateAssetInput {
  equipmentName: string;
  equipmentDescription?: string;
  equipmentTypeID?: number;
  propertyID?: number;
  assetLocationID?: number;
  serialNumber?: string;
  equipmentBarCodeID?: string;
  manufacturerRecordID?: number;
  modelNumber?: string;
  acquisitionDate?: string;
  acquisitionCost?: number;
  warrantyExpiration?: string;
  expectedLifeYears?: number;
  lifecycleStatus?: string;
  conditionRating?: number;
  notes?: string;
  parentEquipmentId?: number | null;
}

export type UpdateAssetInput = Partial<CreateAssetInput>;
