import { z } from "zod";

export const assetStatusSchema = z.enum(["active", "inactive", "disposed", "maintenance"]);

export const assetConditionSchema = z.enum([
  "excellent",
  "good",
  "fair",
  "poor",
  "critical",
]);

export const createAssetSchema = z.object({
  assetName: z.string().min(1, "Asset name is required").max(255),
  assetTag: z.string().max(100).optional(),
  serialNumber: z.string().max(100).optional(),
  assetStatus: assetStatusSchema.default("active"),
  assetCondition: assetConditionSchema.optional(),
  propertyID: z.number().int().positive().optional(),
  categoryID: z.number().int().positive().optional(),
  manufacturerID: z.number().int().positive().optional(),
  modelNumber: z.string().max(100).optional(),
  purchaseDate: z.string().datetime().optional(),
  purchaseCost: z.number().nonnegative().optional(),
  warrantyExpiration: z.string().datetime().optional(),
  notes: z.string().max(4000).optional(),
});

export const updateAssetSchema = createAssetSchema.partial();

export const assetQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.string().max(50).optional(),
  condition: assetConditionSchema.optional(),
  propertyID: z.coerce.number().int().positive().optional(),
  categoryID: z.coerce.number().int().positive().optional(),
  search: z.string().max(255).optional(),
  sortBy: z.enum([
    "equipmentName",
    "equipmentBarCodeID",
    "categoryName",
    "propertyName",
    "conditionRating",
    "lifecycleStatus",
    "acquisitionCost",
    "acquisitionDate",
    "warrantyExpiration",
    "dateCreated",
    "dateModified",
  ]).optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const createConditionLogSchema = z.object({
  conditionScore: z.number().int().min(1).max(5),
  source: z.enum(["manual", "inspection", "work_order"]).default("manual"),
  notes: z.string().max(2000).optional(),
});

export const conditionHistoryQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(20),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export type CreateAssetSchema = z.infer<typeof createAssetSchema>;
export type UpdateAssetSchema = z.infer<typeof updateAssetSchema>;
export type AssetQuerySchema = z.infer<typeof assetQuerySchema>;
export type CreateConditionLogSchema = z.infer<typeof createConditionLogSchema>;
export type ConditionHistoryQuerySchema = z.infer<typeof conditionHistoryQuerySchema>;
