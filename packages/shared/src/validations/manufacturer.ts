import { z } from "zod";

export const manufacturerSearchSchema = z.object({
  q: z.string().max(255).default(""),
});

export const createManufacturerSchema = z.object({
  manufacturerName: z
    .string()
    .min(1, "Manufacturer name is required")
    .max(255),
  contactInfo: z.string().max(500).optional(),
  website: z.string().url("Must be a valid URL").max(255).optional(),
});

export const modelSearchSchema = z.object({
  q: z.string().max(255).default(""),
});

export const createModelSchema = z.object({
  modelName: z.string().min(1, "Model name is required").max(255),
  modelNumber: z.string().max(100).optional(),
  categorySlug: z.string().max(100).optional(),
  specifications: z.string().max(4000).optional(),
});

export type ManufacturerSearchSchema = z.infer<typeof manufacturerSearchSchema>;
export type CreateManufacturerSchema = z.infer<typeof createManufacturerSchema>;
export type ModelSearchSchema = z.infer<typeof modelSearchSchema>;
export type CreateModelSchema = z.infer<typeof createModelSchema>;
