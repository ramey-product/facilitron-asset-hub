import { z } from "zod";

// ---- P1-26: Warehouse Transactions ----

export const transactionTypeSchema = z.enum([
  "issue",
  "receive",
  "adjust",
  "transfer",
  "return",
]);

export const transactionReferenceTypeSchema = z.enum([
  "work-order",
  "purchase-order",
  "transfer",
  "manual",
]);

export const createTransactionSchema = z.object({
  transactionType: transactionTypeSchema,
  partId: z.number().int().positive("Part is required"),
  locationId: z.number().int().positive("Location is required"),
  quantity: z.number().int().refine((v) => v !== 0, "Quantity cannot be zero"),
  reference: z.string().max(255).optional(),
  referenceType: transactionReferenceTypeSchema.optional(),
  notes: z.string().max(2000).optional(),
});

export const listTransactionsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  transactionType: transactionTypeSchema.optional(),
  partId: z.coerce.number().int().positive().optional(),
  locationId: z.coerce.number().int().positive().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  search: z.string().max(255).optional(),
});

// Inferred types
export type CreateTransactionSchema = z.infer<typeof createTransactionSchema>;
export type ListTransactionsQuerySchema = z.infer<typeof listTransactionsQuerySchema>;
