import { z } from "zod";

export const alertStatusSchema = z.enum(["Active", "Dismissed", "Ordered"]);

export const listAlertsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: alertStatusSchema.optional(),
  partId: z.coerce.number().int().positive().optional(),
  propertyId: z.coerce.number().int().positive().optional(),
});

export const createReorderRuleSchema = z.object({
  partId: z.number().int().positive("Part is required"),
  reorderPoint: z.number().int().nonnegative("Reorder point must be >= 0"),
  reorderQuantity: z.number().int().positive("Reorder quantity must be > 0"),
  preferredVendorId: z.number().int().positive().optional(),
  leadTimeDays: z.number().int().nonnegative().default(7),
  propertyId: z.number().int().positive("Property is required"),
});

export const updateReorderRuleSchema = z.object({
  reorderPoint: z.number().int().nonnegative().optional(),
  reorderQuantity: z.number().int().positive().optional(),
  preferredVendorId: z.number().int().positive().optional(),
  leadTimeDays: z.number().int().nonnegative().optional(),
  isActive: z.boolean().optional(),
});

// Inferred types
export type ListAlertsQuerySchema = z.infer<typeof listAlertsQuerySchema>;
export type CreateReorderRuleSchema = z.infer<typeof createReorderRuleSchema>;
export type UpdateReorderRuleSchema = z.infer<typeof updateReorderRuleSchema>;
