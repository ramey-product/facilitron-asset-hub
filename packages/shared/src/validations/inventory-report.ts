import { z } from "zod";

// ---- P1-31: Inventory Reports ----

export const inventoryReportTypeSchema = z.enum([
  "usage-by-part",
  "usage-by-location",
  "usage-by-wo-type",
  "cost-analysis",
  "vendor-spend",
]);

export const reportGroupBySchema = z.enum([
  "monthly",
  "quarterly",
  "category",
  "location",
  "vendor",
]);

export const reportDatePresetSchema = z.enum([
  "30d",
  "90d",
  "ytd",
  "12m",
  "custom",
]);

export const reportFilterSchema = z.object({
  reportType: inventoryReportTypeSchema,
  dateStart: z.string().min(1, "Start date is required"),
  dateEnd: z.string().min(1, "End date is required"),
  datePreset: reportDatePresetSchema.optional(),
  groupBy: reportGroupBySchema,
  partId: z.coerce.number().int().positive().optional(),
  locationId: z.coerce.number().int().positive().optional(),
  vendorId: z.coerce.number().int().positive().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
});

export const createReportTemplateSchema = z.object({
  name: z.string().min(1, "Template name is required").max(255),
  reportType: inventoryReportTypeSchema,
  filter: reportFilterSchema.omit({ reportType: true }),
  isPinned: z.boolean().default(false),
});

export const listReportTemplatesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// Inferred types
export type ReportFilterSchema = z.infer<typeof reportFilterSchema>;
export type CreateReportTemplateSchema = z.infer<typeof createReportTemplateSchema>;
export type ListReportTemplatesQuerySchema = z.infer<typeof listReportTemplatesQuerySchema>;
