import { z } from "zod";

export const listFloorPlansQuerySchema = z.object({
  propertyId: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const createAssetPinSchema = z.object({
  assetId: z.number().int().positive(),
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  iconType: z.string().optional(),
});

export const updateAssetPinSchema = z.object({
  x: z.number().min(0).max(100).optional(),
  y: z.number().min(0).max(100).optional(),
  iconType: z.string().optional(),
});

export const mapFilterSchema = z.object({
  category: z.string().optional(),
  condition: z.enum(["Good", "Fair", "Poor"]).optional(),
  status: z.enum(["online", "offline"]).optional(),
  search: z.string().optional(),
});
