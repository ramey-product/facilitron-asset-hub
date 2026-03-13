import { z } from "zod";

export const tcoQuerySchema = z.object({
  categoryId: z.coerce.number().optional(),
  propertyId: z.coerce.number().optional(),
  minTcoRatio: z.coerce.number().min(0).optional(),
  sortBy: z.enum(["tcoRatio", "totalTco", "annualTco", "ageYears"]).default("tcoRatio"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type TCOQuerySchema = z.infer<typeof tcoQuerySchema>;
