import { z } from "zod";

export const reportTypeSchema = z.enum([
  "reliability",
  "tco",
  "financial",
  "fixed-asset-register",
  "downtime",
  "meter-readings",
  "lifecycle",
]);

export const reportFormatSchema = z.enum(["pdf", "csv", "excel"]);

export const reportCadenceSchema = z.enum(["daily", "weekly", "monthly", "quarterly"]);

export const reportDateRangeSchema = z.enum(["7d", "30d", "90d", "6m", "12m"]);

export const createReportScheduleSchema = z.object({
  name: z.string().min(1).max(100),
  reportType: reportTypeSchema,
  format: reportFormatSchema,
  cadence: reportCadenceSchema,
  dateRange: reportDateRangeSchema,
  recipients: z.array(z.string().email()).min(1).max(20),
  isActive: z.boolean().optional().default(true),
});

export const updateReportScheduleSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  reportType: reportTypeSchema.optional(),
  format: reportFormatSchema.optional(),
  cadence: reportCadenceSchema.optional(),
  dateRange: reportDateRangeSchema.optional(),
  recipients: z.array(z.string().email()).min(1).max(20).optional(),
  isActive: z.boolean().optional(),
});

export const listReportSchedulesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  isActive: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  reportType: reportTypeSchema.optional(),
});

export const listReportDeliveriesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  scheduleId: z.coerce.number().int().positive().optional(),
  status: z.enum(["delivered", "failed", "pending"]).optional(),
});
