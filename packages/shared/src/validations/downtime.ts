import { z } from "zod";

export const createDowntimeEventSchema = z.object({
  startTime: z.string().optional(),
  reason: z.string().min(1, "Reason is required"),
  reasonDescription: z.string().max(2000).optional(),
  associatedWoId: z.number().optional(),
});

export const resolveDowntimeEventSchema = z.object({
  endTime: z.string().optional(),
  resolvedBy: z.number().optional(),
});

export const listDowntimeEventsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(25),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  reason: z.string().optional(),
  ongoingOnly: z.coerce.boolean().optional(),
});

export const downtimeStatsSchema = z.object({
  window: z.enum(["90d", "6m", "12m"]).default("90d"),
});

export type CreateDowntimeEventSchema = z.infer<typeof createDowntimeEventSchema>;
export type ListDowntimeEventsSchema = z.infer<typeof listDowntimeEventsSchema>;
export type DowntimeStatsSchema = z.infer<typeof downtimeStatsSchema>;
