import { z } from "zod";

export const createMeterReadingSchema = z.object({
  value: z.number().min(0, "Reading value must be non-negative"),
  readingDate: z.string().optional(),
  notes: z.string().max(2000).optional(),
});

export const updateMeterThresholdSchema = z.object({
  thresholdValue: z.number().min(0, "Threshold must be non-negative"),
  triggerMode: z.enum(["once", "recurring"]).optional(),
  intervalValue: z.number().min(1).optional(),
  pmTemplateDescription: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
});

export const listMeterReadingsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(25),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type CreateMeterReadingSchema = z.infer<typeof createMeterReadingSchema>;
export type UpdateMeterThresholdSchema = z.infer<typeof updateMeterThresholdSchema>;
export type ListMeterReadingsSchema = z.infer<typeof listMeterReadingsSchema>;
