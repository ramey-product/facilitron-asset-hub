import { z } from "zod";

// ---- P1-28: Notifications & Alerts ----

export const notificationTypeSchema = z.enum([
  "new-request",
  "approved",
  "fulfilled",
  "rejected",
  "low-stock",
]);

export const notificationFrequencySchema = z.enum([
  "instant",
  "daily",
  "weekly",
  "none",
]);

export const emailStatusSchema = z.enum(["sent", "failed", "pending"]);

export const updatePreferencesSchema = z.object({
  preferences: z
    .array(
      z.object({
        notificationType: notificationTypeSchema,
        frequency: notificationFrequencySchema,
        enabled: z.boolean(),
      })
    )
    .min(1, "At least one preference is required"),
});

export const listEmailLogQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  notificationType: notificationTypeSchema.optional(),
  status: emailStatusSchema.optional(),
});

// Inferred types
export type UpdatePreferencesSchema = z.infer<typeof updatePreferencesSchema>;
export type ListEmailLogQuerySchema = z.infer<typeof listEmailLogQuerySchema>;
