import { z } from "zod";

export const consumptionQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  partId: z.coerce.number().int().positive().optional(),
  workOrderId: z.coerce.number().int().positive().optional(),
  locationId: z.coerce.number().int().positive().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

export const consumptionForecastQuerySchema = z.object({
  partId: z.coerce.number().int().positive(),
});

export const auditQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  partId: z.coerce.number().int().positive().optional(),
  locationId: z.coerce.number().int().positive().optional(),
  changeType: z
    .enum(["consumption", "adjustment", "reversal", "receiving", "transfer"])
    .optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
});

export type ConsumptionQuerySchema = z.infer<typeof consumptionQuerySchema>;
export type ConsumptionForecastQuerySchema = z.infer<
  typeof consumptionForecastQuerySchema
>;
export type AuditQuerySchema = z.infer<typeof auditQuerySchema>;
