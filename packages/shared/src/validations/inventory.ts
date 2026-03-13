import { z } from "zod";

// ---- P1-17: Parts Catalog ----

export const partStatusSchema = z.enum(["active", "inactive", "all"]);

export const partQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().max(255).optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  vendorId: z.coerce.number().int().positive().optional(),
  status: partStatusSchema.default("active"),
  sortBy: z
    .enum([
      "name",
      "sku",
      "categoryName",
      "unitCost",
      "vendorName",
      "reorderPoint",
      "createdAt",
      "updatedAt",
    ])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const createPartSchema = z.object({
  name: z.string().min(1, "Part name is required").max(255),
  sku: z.string().min(1, "SKU is required").max(100),
  description: z.string().max(2000).optional(),
  categoryId: z.number().int().positive("Category is required"),
  unitCost: z.number().nonnegative().default(0),
  unitOfMeasure: z.string().max(50).default("each"),
  vendorId: z.number().int().positive().optional(),
  minQty: z.number().int().nonnegative().default(0),
  maxQty: z.number().int().nonnegative().default(0),
  reorderPoint: z.number().int().nonnegative().default(0),
  storageLocation: z.string().max(255).optional(),
  imageUrl: z.string().url().max(500).optional(),
});

export const updatePartSchema = createPartSchema.partial();

export const bulkPartIdsSchema = z.object({
  ids: z.array(z.number().int().positive()).min(1, "At least one ID is required"),
});

// ---- P1-18: Multi-Location Stock ----

export const stockAdjustSchema = z.object({
  qtyOnHand: z.number().int().nonnegative().optional(),
  qtyReserved: z.number().int().nonnegative().optional(),
  reason: z.string().min(1, "Reason is required").max(500),
  notes: z.string().max(2000).optional(),
});

export const stockRollupQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(["in-stock", "low-stock", "out-of-stock", "all"]).default("all"),
  search: z.string().max(255).optional(),
  sortBy: z
    .enum([
      "partName",
      "sku",
      "totalOnHand",
      "totalAvailable",
      "reorderPoint",
      "locationCount",
    ])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const stockAlertQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  severity: z.enum(["warning", "critical", "all"]).default("all"),
});

// Inferred types
export type PartQuerySchema = z.infer<typeof partQuerySchema>;
export type CreatePartSchema = z.infer<typeof createPartSchema>;
export type UpdatePartSchema = z.infer<typeof updatePartSchema>;
export type BulkPartIdsSchema = z.infer<typeof bulkPartIdsSchema>;
export type StockAdjustSchema = z.infer<typeof stockAdjustSchema>;
export type StockRollupQuerySchema = z.infer<typeof stockRollupQuerySchema>;
export type StockAlertQuerySchema = z.infer<typeof stockAlertQuerySchema>;
