import { z } from "zod";

export const reparentSchema = z.object({
  parentEquipmentId: z.number().int().positive().nullable(),
});

export const bulkReparentSchema = z.object({
  items: z
    .array(
      z.object({
        assetId: z.number().int().positive(),
        newParentId: z.number().int().positive().nullable(),
      })
    )
    .min(1)
    .max(100),
});

export type ReparentSchema = z.infer<typeof reparentSchema>;
export type BulkReparentSchema = z.infer<typeof bulkReparentSchema>;
