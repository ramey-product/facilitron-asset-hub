import { z } from "zod";

export const transferStatusSchema = z.enum([
  "Requested",
  "Approved",
  "InTransit",
  "Received",
  "Cancelled",
]);

export const listTransfersQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: transferStatusSchema.optional(),
  partId: z.coerce.number().int().positive().optional(),
  search: z.string().max(255).optional(),
  sortBy: z.enum(["transferNumber", "createdAt", "status"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export const createTransferSchema = z.object({
  partId: z.number().int().positive("Part is required"),
  fromLocationId: z.number().int().positive("Source location is required"),
  toLocationId: z.number().int().positive("Destination location is required"),
  quantity: z.number().int().positive("Quantity must be > 0"),
  notes: z.string().max(2000).optional(),
});

// Inferred types
export type ListTransfersQuerySchema = z.infer<typeof listTransfersQuerySchema>;
export type CreateTransferSchema = z.infer<typeof createTransferSchema>;
