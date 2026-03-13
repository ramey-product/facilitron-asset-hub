import { z } from "zod";

// ---- P1-27: Pick Lists ----

export const pickListStatusSchema = z.enum([
  "draft",
  "in-progress",
  "completed",
  "on-hold",
]);

export const pickListDateRangeSchema = z.enum(["today", "tomorrow", "week"]);

export const createPickListSchema = z.object({
  name: z.string().max(255).optional(),
  woIds: z.array(z.number().int().positive()).optional(),
  dateRange: pickListDateRangeSchema.optional(),
});

export const listPickListsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: pickListStatusSchema.optional(),
  search: z.string().max(255).optional(),
});

// Inferred types
export type CreatePickListSchema = z.infer<typeof createPickListSchema>;
export type ListPickListsQuerySchema = z.infer<typeof listPickListsQuerySchema>;
