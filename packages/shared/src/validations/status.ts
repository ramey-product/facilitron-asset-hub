import { z } from "zod";

export const operationalStatusSchema = z.enum(["online", "offline"]);

export const statusChangeSchema = z.object({
  status: operationalStatusSchema,
  reasonCode: z.string().max(50).nullable().default(null),
  notes: z.string().max(2000).nullable().default(null),
});

export const statusHistoryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type StatusChangeSchema = z.infer<typeof statusChangeSchema>;
export type StatusHistoryQuerySchema = z.infer<typeof statusHistoryQuerySchema>;
