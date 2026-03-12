import { z } from "zod";

export const updateSettingSchema = z.object({
  value: z.string().min(1, "Setting value is required").max(4000),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(255),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must be lowercase alphanumeric with hyphens"
    ),
  description: z.string().max(500).optional(),
  icon: z.string().max(50).optional(),
  color: z
    .string()
    .max(7)
    .regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a hex color code")
    .optional(),
  sortOrder: z.number().int().nonnegative().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export type UpdateSettingSchema = z.infer<typeof updateSettingSchema>;
export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;
