import { z } from "zod";

export const vendorCategorySchema = z.enum(["parts", "service", "both"]);

export const vendorQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().max(255).optional(),
  category: vendorCategorySchema.optional(),
  isActive: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  ratingMin: z.coerce.number().int().min(1).max(5).optional(),
  sortBy: z
    .enum(["name", "rating", "category", "contractExpiry", "createdAt"])
    .optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const createVendorSchema = z.object({
  name: z.string().min(1, "Vendor name is required").max(255),
  category: vendorCategorySchema,
  contactName: z.string().max(255).optional(),
  email: z.string().email().max(255).optional(),
  phone: z.string().max(50).optional(),
  address: z.string().max(500).optional(),
  website: z.string().url().max(255).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  notes: z.string().max(4000).optional(),
  contractExpiry: z.string().datetime().optional(),
});

export const updateVendorSchema = createVendorSchema.partial();

export const vendorCompareSchema = z.object({
  ids: z
    .string()
    .min(1, "At least one vendor ID is required")
    .transform((v) => v.split(",").map((id) => parseInt(id.trim(), 10)))
    .refine((ids) => ids.every((id) => !isNaN(id) && id > 0), {
      message: "All IDs must be positive integers",
    })
    .refine((ids) => ids.length >= 2 && ids.length <= 5, {
      message: "Must compare between 2 and 5 vendors",
    }),
});

export type VendorQuerySchema = z.infer<typeof vendorQuerySchema>;
export type CreateVendorSchema = z.infer<typeof createVendorSchema>;
export type UpdateVendorSchema = z.infer<typeof updateVendorSchema>;
export type VendorCompareSchema = z.infer<typeof vendorCompareSchema>;
