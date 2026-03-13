/**
 * Provider interfaces — both mock and Drizzle implementations satisfy these contracts.
 */

import type {
  PaginationMeta,
  AssetRecord,
  ListAssetsQuery,
  CreateAssetInput,
  UpdateAssetInput,
  DashboardStats,
  DashboardAlert,
  DashboardAlertType,
  ActivityEvent,
  HierarchyNode,
  HierarchyRollup,
  BulkReparentResult,
  OperationalStatus,
  StatusReason,
  StatusRecord,
  StatusHistoryEntry,
  CostSummary,
  MonthlyCostBreakdown,
  TopCostAsset,
  ImportColumnMapping,
  ImportValidationResult,
  ImportResult,
  ImportHistoryEntry,
  ImportFieldDefinition,
  AssetPhoto,
  AssetDocument,
  CustomFieldDefinition,
  CustomFieldValue,
  CreatePhotoInput,
  CreateDocumentInput,
  CreateCustomFieldDefinitionInput,
  UpdateCustomFieldDefinitionInput,
  UpdateCustomFieldValuesInput,
  FitSummary,
  FitInspectionRecord,
} from "@asset-hub/shared";

// Re-export asset types so existing imports from providers.ts still work
export type { AssetRecord, ListAssetsQuery, CreateAssetInput, UpdateAssetInput };

// ---- Generic pagination wrapper ----

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

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

// ---- Dashboard types ----

export interface DashboardProvider {
  getStats(customerID: number, propertyId?: number): Promise<DashboardStats>;
  getAlerts(customerID: number, type: DashboardAlertType | undefined, page: number, limit: number, propertyId?: number): Promise<PaginatedResult<DashboardAlert>>;
  getActivity(customerID: number, page: number, limit: number, propertyId?: number): Promise<PaginatedResult<ActivityEvent>>;
}

// ---- Hierarchy types ----

export interface HierarchyProvider {
  getTree(customerID: number, assetId: number): Promise<HierarchyNode | null>;
  getRollup(customerID: number, assetId: number): Promise<HierarchyRollup | null>;
  reparent(customerID: number, assetId: number, newParentId: number | null, contactId: number): Promise<{ success: boolean; error?: string }>;
  bulkReparent(customerID: number, items: { assetId: number; newParentId: number | null }[], contactId: number): Promise<BulkReparentResult>;
}

// ---- Status types ----

export interface StatusProvider {
  getStatus(customerID: number, assetId: number): Promise<StatusRecord | null>;
  updateStatus(customerID: number, assetId: number, status: OperationalStatus, reasonCode: string | null, notes: string | null, changedBy: number): Promise<StatusRecord | null>;
  getHistory(customerID: number, assetId: number, page: number, limit: number): Promise<PaginatedResult<StatusHistoryEntry>>;
  getReasons(): StatusReason[];
}

// ---- Cost types ----

export interface WorkOrderRecord {
  workOrderId: number;
  customerID: number;
  equipmentRecordID: number;
  workOrderNumber: string;
  description: string;
  laborCost: number;
  partsCost: number;
  vendorCost: number;
  completedDate: string;
  status: string;
}

export interface CostProvider {
  getCostSummary(customerID: number, assetId: number): Promise<CostSummary | null>;
  getCostHistory(customerID: number, assetId: number, months: number): Promise<MonthlyCostBreakdown[]>;
  getTopCostAssets(customerID: number, limit: number): Promise<TopCostAsset[]>;
}

// ---- Import types ----

export interface ImportProvider {
  validate(
    customerID: number,
    rows: Record<string, string>[],
    mapping: ImportColumnMapping[]
  ): Promise<ImportValidationResult>;
  execute(
    customerID: number,
    contactId: number,
    filename: string,
    rows: Record<string, string>[],
    mapping: ImportColumnMapping[]
  ): Promise<ImportResult>;
  getHistory(
    customerID: number,
    page: number,
    limit: number
  ): Promise<PaginatedResult<ImportHistoryEntry>>;
  getTemplate(): ImportFieldDefinition[];
}

// ---- Document/Photo types (P0-08) ----

export interface DocumentProvider {
  listPhotos(customerID: number, assetId: number): Promise<AssetPhoto[]>;
  addPhoto(customerID: number, assetId: number, uploadedBy: number, data: CreatePhotoInput): Promise<AssetPhoto>;
  deletePhoto(customerID: number, assetId: number, photoId: number): Promise<boolean>;
  setPrimaryPhoto(customerID: number, assetId: number, photoId: number): Promise<AssetPhoto | null>;
  listDocuments(customerID: number, assetId: number): Promise<AssetDocument[]>;
  addDocument(customerID: number, assetId: number, uploadedBy: number, data: CreateDocumentInput): Promise<AssetDocument>;
  deleteDocument(customerID: number, assetId: number, docId: number): Promise<boolean>;
}

// ---- Custom Fields types (P0-08) ----

export interface CustomFieldProvider {
  listDefinitions(customerID: number): Promise<CustomFieldDefinition[]>;
  createDefinition(customerID: number, data: CreateCustomFieldDefinitionInput): Promise<CustomFieldDefinition>;
  updateDefinition(customerID: number, id: number, data: UpdateCustomFieldDefinitionInput): Promise<CustomFieldDefinition | null>;
  deleteDefinition(customerID: number, id: number): Promise<boolean>;
  getAssetValues(customerID: number, assetId: number): Promise<CustomFieldValue[]>;
  updateAssetValues(customerID: number, assetId: number, data: UpdateCustomFieldValuesInput): Promise<CustomFieldValue[]>;
}

// ---- FIT types (P0-16) ----

export interface FitProvider {
  getSummary(customerID: number, assetId: number): Promise<FitSummary | null>;
  getInspections(customerID: number, assetId: number, page: number, limit: number): Promise<PaginatedResult<FitInspectionRecord>>;
}
