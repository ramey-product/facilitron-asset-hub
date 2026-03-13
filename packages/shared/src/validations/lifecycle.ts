import { z } from "zod";

export const lifecycleStageSchema = z.enum([
  "Procurement",
  "Active",
  "UnderMaintenance",
  "ScheduledForReplacement",
  "Disposed",
]);

export const createLifecycleEventSchema = z.object({
  assetId: z.number().int().positive(),
  toStage: lifecycleStageSchema,
  reason: z.string().min(1).max(500),
  notes: z.string().max(2000).optional(),
  transitionDate: z.string().datetime().optional(),
});

export const listLifecycleEventsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(50),
  stage: lifecycleStageSchema.optional(),
});

export const lifecycleForecastQuerySchema = z.object({
  years: z.coerce.number().int().min(1).max(10).default(5),
});
