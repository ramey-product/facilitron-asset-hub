import { z } from "zod";

export const importColumnMappingSchema = z.object({
  sourceColumn: z.string().min(1, "Source column is required"),
  targetField: z.string().min(1, "Target field is required"),
  confidence: z.number().min(0).max(1),
});

export const importValidateSchema = z.object({
  rows: z
    .array(z.record(z.string(), z.string()))
    .min(1, "At least one row is required")
    .max(10000, "Maximum 10,000 rows per import"),
  mapping: z
    .array(importColumnMappingSchema)
    .min(1, "At least one column mapping is required"),
});

export const importExecuteSchema = z.object({
  rows: z
    .array(z.record(z.string(), z.string()))
    .min(1, "At least one row is required")
    .max(10000, "Maximum 10,000 rows per import"),
  mapping: z
    .array(importColumnMappingSchema)
    .min(1, "At least one column mapping is required"),
  filename: z.string().min(1, "Filename is required").max(255),
});

export const importHistoryQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type ImportValidateSchema = z.infer<typeof importValidateSchema>;
export type ImportExecuteSchema = z.infer<typeof importExecuteSchema>;
export type ImportHistoryQuerySchema = z.infer<typeof importHistoryQuerySchema>;
