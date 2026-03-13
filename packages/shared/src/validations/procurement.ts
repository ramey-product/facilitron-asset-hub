import { z } from "zod";

// ---- Purchase Order Status ----

export const purchaseOrderStatusSchema = z.enum([
  "Draft",
  "Submitted",
  "Approved",
  "Ordered",
  "PartiallyReceived",
  "Received",
  "Cancelled",
]);

// ---- Line Item schemas ----

export const poLineItemInputSchema = z.object({
  partId: z.number().int().positive(),
  quantity: z.number().positive(),
  unitCost: z.number().min(0),
  taxRate: z.number().min(0).max(100).optional().default(0),
  notes: z.string().max(1000).optional(),
});

// ---- Purchase Order CRUD ----

export const createPurchaseOrderSchema = z.object({
  vendorId: z.number().int().positive(),
  propertyId: z.number().int().positive(),
  notes: z.string().max(4000).optional(),
  lineItems: z.array(poLineItemInputSchema).min(1, "At least one line item is required"),
});

export const updatePurchaseOrderSchema = z.object({
  vendorId: z.number().int().positive().optional(),
  notes: z.string().max(4000).optional(),
  lineItems: z.array(poLineItemInputSchema).min(1).optional(),
});

export const listPurchaseOrdersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: purchaseOrderStatusSchema.optional(),
  vendorId: z.coerce.number().int().positive().optional(),
  search: z.string().max(255).optional(),
  sortBy: z.enum(["poNumber", "createdAt", "totalAmount", "status"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export const approvePoSchema = z.object({
  approvedBy: z.number().int().positive(),
});

// ---- Receiving ----

export const receivingLineItemInputSchema = z.object({
  poLineItemId: z.number().int().positive(),
  quantityReceived: z.number().min(0),
  quantityRejected: z.number().min(0).optional().default(0),
  rejectionReason: z.string().max(1000).optional(),
  locationId: z.number().int().positive(),
});

export const createReceivingSchema = z.object({
  poId: z.number().int().positive(),
  notes: z.string().max(4000).optional(),
  lineItems: z.array(receivingLineItemInputSchema).min(1, "At least one line item is required"),
});

export const listReceivingSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  poId: z.coerce.number().int().positive().optional(),
  search: z.string().max(255).optional(),
});

// ---- Type exports ----

export type CreatePurchaseOrderSchema = z.infer<typeof createPurchaseOrderSchema>;
export type UpdatePurchaseOrderSchema = z.infer<typeof updatePurchaseOrderSchema>;
export type ListPurchaseOrdersSchema = z.infer<typeof listPurchaseOrdersSchema>;
export type CreateReceivingSchema = z.infer<typeof createReceivingSchema>;
export type ListReceivingSchema = z.infer<typeof listReceivingSchema>;
