import { z } from "zod";

export const costHistoryQuerySchema = z.object({
  months: z.coerce.number().int().positive().max(36).default(12),
});

export const topCostAssetsQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export type CostHistoryQuery = z.infer<typeof costHistoryQuerySchema>;
export type TopCostAssetsQuery = z.infer<typeof topCostAssetsQuerySchema>;
