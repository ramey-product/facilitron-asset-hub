/**
 * Provider interfaces — both mock and Drizzle implementations satisfy these contracts.
 */

import type { PaginationMeta } from "@asset-hub/shared";

// ---- Generic pagination wrapper ----

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

// ---- Asset types (aligned with Drizzle Equipment schema) ----

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
  // Joined fields for list display
  propertyName?: string;
  locationName?: string;
  categorySlug?: string;
  categoryName?: string;
  manufacturerName?: string;
  equipmentTypeName?: string;
}

export interface ListAssetsQuery {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  condition?: string;
  categoryID?: number;
  locationID?: number;
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
}

export type UpdateAssetInput = Partial<CreateAssetInput>;

export interface AssetProvider {
  list(customerID: number, query: ListAssetsQuery): Promise<PaginatedResult<AssetRecord>>;
  getById(customerID: number, id: number): Promise<AssetRecord | null>;
  create(customerID: number, contactId: number, data: CreateAssetInput): Promise<AssetRecord>;
  update(customerID: number, id: number, contactId: number, data: UpdateAssetInput): Promise<AssetRecord | null>;
  delete(customerID: number, id: number): Promise<boolean>;
}

// ---- Settings types ----

export interface SettingRecord {
  id: number;
  customerId: number;
  settingKey: string;
  settingValue: string;
  updatedBy: number | null;
  updatedAt: string;
}

export interface CategoryRecord {
  id: number;
  customerId: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export interface SettingsProvider {
  getAll(customerID: number): Promise<SettingRecord[]>;
  getByKey(customerID: number, key: string): Promise<SettingRecord | null>;
  upsert(customerID: number, contactId: number, key: string, value: string): Promise<SettingRecord>;
  listCategories(customerID: number): Promise<CategoryRecord[]>;
  createCategory(customerID: number, contactId: number, data: CreateCategoryInput): Promise<CategoryRecord>;
  updateCategory(customerID: number, id: number, data: UpdateCategoryInput): Promise<CategoryRecord | null>;
  deleteCategory(customerID: number, id: number): Promise<boolean>;
}

// ---- Manufacturer types ----

export interface ManufacturerRecord {
  manufacturerRecordID: number;
  customerID: number;
  manufacturerName: string;
  contactInfo: string | null;
  website: string | null;
  isActive: boolean;
}

export interface ManufacturerModelRecord {
  id: number;
  manufacturerRecordId: number;
  customerId: number;
  modelName: string;
  modelNumber: string | null;
  categorySlug: string | null;
  specifications: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateManufacturerInput {
  manufacturerName: string;
  contactInfo?: string;
  website?: string;
}

export interface CreateModelInput {
  modelName: string;
  modelNumber?: string;
  categorySlug?: string;
  specifications?: string;
}

export interface ManufacturerProvider {
  search(customerID: number, query: string): Promise<ManufacturerRecord[]>;
  getById(customerID: number, id: number): Promise<ManufacturerRecord | null>;
  getModels(customerID: number, manufacturerId: number, query?: string): Promise<ManufacturerModelRecord[]>;
  create(customerID: number, data: CreateManufacturerInput): Promise<ManufacturerRecord>;
  createModel(customerID: number, manufacturerId: number, data: CreateModelInput): Promise<ManufacturerModelRecord>;
}

// ---- Condition Tracking types ----

export interface ConditionLogRecord {
  id: number;
  equipmentRecordId: number;
  customerId: number;
  conditionScore: number;
  previousScore: number | null;
  source: "manual" | "inspection" | "work_order";
  notes: string | null;
  loggedBy: number;
  loggedAt: string;
}

export interface ConditionScaleRecord {
  conditionID: number;
  customerID: number;
  conditionName: string;
  conditionScore: number;
  colorCode: string;
  description: string;
  isActive: boolean;
}

export interface CreateConditionLogInput {
  conditionScore: number;
  source?: "manual" | "inspection" | "work_order";
  notes?: string;
}

export interface ConditionStats {
  currentScore: number;
  currentLabel: string;
  previousScore: number | null;
  trend: "improving" | "declining" | "stable";
  totalLogs: number;
  lastLoggedAt: string;
  averageScore: number;
  scoreHistory: { date: string; score: number }[];
}

export interface ConditionProvider {
  getScale(customerID: number): Promise<ConditionScaleRecord[]>;
  getHistory(customerID: number, equipmentId: number, limit: number, offset: number): Promise<PaginatedResult<ConditionLogRecord>>;
  getStats(customerID: number, equipmentId: number): Promise<ConditionStats | null>;
  logCondition(customerID: number, equipmentId: number, loggedBy: number, data: CreateConditionLogInput): Promise<ConditionLogRecord>;
}
