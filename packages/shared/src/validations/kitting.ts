import { z } from "zod";

export const listKitsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().max(255).optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  isActive: z
    .string()
    .transform((v) => (v === "true" ? true : v === "false" ? false : undefined))
    .optional(),
});

export const kitItemSchema = z.object({
  partId: z.number().int().positive("Part is required"),
  quantity: z.number().int().positive("Quantity must be > 0"),
});

export const createKitSchema = z.object({
  name: z.string().min(1, "Kit name is required").max(255),
  description: z.string().max(2000).optional(),
  categoryId: z.number().int().positive().optional(),
  items: z.array(kitItemSchema).min(1, "At least one component is required"),
});

export const updateKitSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  categoryId: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
  items: z.array(kitItemSchema).optional(),
});

export const kitCheckoutSchema = z.object({
  kitId: z.number().int().positive("Kit is required"),
  locationId: z.number().int().positive("Location is required"),
  workOrderId: z.number().int().positive().optional(),
  notes: z.string().max(2000).optional(),
});

// Inferred types
export type ListKitsQuerySchema = z.infer<typeof listKitsQuerySchema>;
export type CreateKitSchema = z.infer<typeof createKitSchema>;
export type UpdateKitSchema = z.infer<typeof updateKitSchema>;
export type KitCheckoutSchema = z.infer<typeof kitCheckoutSchema>;
