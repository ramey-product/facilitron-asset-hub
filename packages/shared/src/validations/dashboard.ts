import { z } from "zod";

export const dashboardAlertTypeSchema = z.enum([
  "overdue_maintenance",
  "poor_condition",
  "expired_warranty",
  "expiring_warranty",
]);

export const dashboardAlertsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  type: dashboardAlertTypeSchema.optional(),
});

export const dashboardActivityQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});

export type DashboardAlertsQuery = z.infer<typeof dashboardAlertsQuerySchema>;
export type DashboardActivityQuery = z.infer<typeof dashboardActivityQuerySchema>;
