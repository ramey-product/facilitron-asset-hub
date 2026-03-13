import { z } from "zod";

export const depreciationRegisterQuerySchema = z.object({
  categoryId: z.coerce.number().optional(),
  propertyId: z.coerce.number().optional(),
  method: z.enum(["straight-line", "declining-balance"]).optional(),
  fullyDepreciatedOnly: z.coerce.boolean().optional(),
  sortBy: z.enum(["assetName", "acquisitionDate", "originalCost", "currentBookValue", "yearsElapsed"]).default("assetName"),
  sortOrder: z.enum(["asc", "desc"]).default("asc"),
});

export type DepreciationRegisterQuerySchema = z.infer<typeof depreciationRegisterQuerySchema>;
