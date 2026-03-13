import { z } from "zod";

// ---- Custom field definition schemas ----

export const createCustomFieldDefinitionSchema = z.object({
  fieldName: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z][a-z0-9_]*$/, "Must be lowercase snake_case"),
  fieldLabel: z.string().min(1).max(200),
  fieldType: z.enum(["text", "number", "date", "select", "boolean"]),
  options: z.array(z.string().min(1)).optional(),
  isRequired: z.boolean().optional(),
  displayOrder: z.coerce.number().int().min(0).optional(),
});

export const updateCustomFieldDefinitionSchema = z.object({
  fieldLabel: z.string().min(1).max(200).optional(),
  fieldType: z.enum(["text", "number", "date", "select", "boolean"]).optional(),
  options: z.array(z.string().min(1)).optional(),
  isRequired: z.boolean().optional(),
  displayOrder: z.coerce.number().int().min(0).optional(),
});

// ---- Custom field value schemas ----

export const updateCustomFieldValuesSchema = z.object({
  values: z.array(
    z.object({
      definitionId: z.coerce.number().int().positive(),
      value: z.union([z.string(), z.number(), z.boolean(), z.null()]),
    })
  ),
});
