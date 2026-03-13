import { z } from "zod";

// ---- P1-30: Tool Room Management ----

export const toolCheckoutStatusSchema = z.enum([
  "checked-out",
  "returned",
  "overdue",
]);

export const returnConditionSchema = z.enum(["good", "fair", "poor"]);

export const createCheckoutSchema = z.object({
  toolId: z.number().int().positive("Tool is required"),
  checkedOutBy: z.number().int().positive("User is required"),
  expectedReturnDate: z.string().min(1, "Expected return date is required"),
  notes: z.string().max(2000).optional(),
});

export const returnToolSchema = z.object({
  condition: returnConditionSchema,
  notes: z.string().max(2000).optional(),
});

export const listCheckoutsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: toolCheckoutStatusSchema.optional(),
  toolId: z.coerce.number().int().positive().optional(),
  search: z.string().max(255).optional(),
});

// Inferred types
export type CreateCheckoutSchema = z.infer<typeof createCheckoutSchema>;
export type ReturnToolSchema = z.infer<typeof returnToolSchema>;
export type ListCheckoutsQuerySchema = z.infer<typeof listCheckoutsQuerySchema>;
