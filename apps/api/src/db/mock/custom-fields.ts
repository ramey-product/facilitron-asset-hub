import type {
  CustomFieldDefinition,
  CustomFieldValue,
  CreateCustomFieldDefinitionInput,
  UpdateCustomFieldDefinitionInput,
  UpdateCustomFieldValuesInput,
} from "@asset-hub/shared";
import type { CustomFieldProvider } from "../../types/providers.js";

// ---- Seed: 5 custom field definitions for customerID=1 ----

let nextDefId = 6;

const definitions: CustomFieldDefinition[] = [
  {
    id: 1,
    customerID: 1,
    fieldName: "floor_level",
    fieldLabel: "Floor Level",
    fieldType: "select",
    options: ["Basement", "Ground", "1st Floor", "2nd Floor", "3rd Floor", "Roof"],
    isRequired: false,
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 2,
    customerID: 1,
    fieldName: "room_number",
    fieldLabel: "Room Number",
    fieldType: "text",
    isRequired: false,
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 3,
    customerID: 1,
    fieldName: "last_painted",
    fieldLabel: "Last Painted",
    fieldType: "date",
    isRequired: false,
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 4,
    customerID: 1,
    fieldName: "fire_rating",
    fieldLabel: "Fire Rating",
    fieldType: "select",
    options: ["1-Hour", "2-Hour", "3-Hour", "Not Rated"],
    isRequired: false,
    displayOrder: 4,
    isActive: true,
  },
  {
    id: 5,
    customerID: 1,
    fieldName: "ada_compliant",
    fieldLabel: "ADA Compliant",
    fieldType: "boolean",
    isRequired: false,
    displayOrder: 5,
    isActive: true,
  },
];

// ---- Seed: some initial values for a few assets ----

interface StoredFieldValue {
  assetId: number;
  definitionId: number;
  value: string | number | boolean | null;
}

const fieldValues: StoredFieldValue[] = [
  // Asset 1 - Gym Rooftop Unit #1
  { assetId: 1, definitionId: 1, value: "Roof" },
  { assetId: 1, definitionId: 2, value: "RTU-001" },
  { assetId: 1, definitionId: 5, value: false },
  // Asset 10 - Main Distribution Panel A
  { assetId: 10, definitionId: 1, value: "Ground" },
  { assetId: 10, definitionId: 2, value: "E-100" },
  { assetId: 10, definitionId: 4, value: "2-Hour" },
  { assetId: 10, definitionId: 5, value: true },
  // Asset 19 - Main Fire Alarm Panel
  { assetId: 19, definitionId: 1, value: "Ground" },
  { assetId: 19, definitionId: 2, value: "E-100" },
  { assetId: 19, definitionId: 4, value: "2-Hour" },
  // Asset 23 - Main Tower Elevator #1
  { assetId: 23, definitionId: 1, value: "Ground" },
  { assetId: 23, definitionId: 5, value: true },
  // Asset 25 - Boiler Room Fire Door
  { assetId: 25, definitionId: 4, value: "3-Hour" },
  { assetId: 25, definitionId: 3, value: "2024-06-15" },
];

function resolveValues(
  customerID: number,
  assetId: number
): CustomFieldValue[] {
  const defs = definitions.filter(
    (d) => d.customerID === customerID && d.isActive
  );
  return defs.map((def) => {
    const stored = fieldValues.find(
      (fv) => fv.assetId === assetId && fv.definitionId === def.id
    );
    return {
      definitionId: def.id,
      fieldName: def.fieldName,
      fieldLabel: def.fieldLabel,
      fieldType: def.fieldType,
      value: stored?.value ?? null,
    };
  });
}

export const mockCustomFieldProvider: CustomFieldProvider = {
  async listDefinitions(customerID: number): Promise<CustomFieldDefinition[]> {
    return definitions
      .filter((d) => d.customerID === customerID && d.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  },

  async createDefinition(
    customerID: number,
    data: CreateCustomFieldDefinitionInput
  ): Promise<CustomFieldDefinition> {
    const maxOrder = definitions
      .filter((d) => d.customerID === customerID)
      .reduce((max, d) => Math.max(max, d.displayOrder), 0);

    const newDef: CustomFieldDefinition = {
      id: nextDefId++,
      customerID,
      fieldName: data.fieldName,
      fieldLabel: data.fieldLabel,
      fieldType: data.fieldType,
      options: data.options,
      isRequired: data.isRequired ?? false,
      displayOrder: data.displayOrder ?? maxOrder + 1,
      isActive: true,
    };
    definitions.push(newDef);
    return newDef;
  },

  async updateDefinition(
    customerID: number,
    id: number,
    data: UpdateCustomFieldDefinitionInput
  ): Promise<CustomFieldDefinition | null> {
    const def = definitions.find(
      (d) => d.id === id && d.customerID === customerID
    );
    if (!def) return null;

    if (data.fieldLabel !== undefined) def.fieldLabel = data.fieldLabel;
    if (data.fieldType !== undefined) def.fieldType = data.fieldType;
    if (data.options !== undefined) def.options = data.options;
    if (data.isRequired !== undefined) def.isRequired = data.isRequired;
    if (data.displayOrder !== undefined) def.displayOrder = data.displayOrder;

    return def;
  },

  async deleteDefinition(
    customerID: number,
    id: number
  ): Promise<boolean> {
    const def = definitions.find(
      (d) => d.id === id && d.customerID === customerID
    );
    if (!def) return false;
    def.isActive = false; // soft delete
    return true;
  },

  async getAssetValues(
    customerID: number,
    assetId: number
  ): Promise<CustomFieldValue[]> {
    return resolveValues(customerID, assetId);
  },

  async updateAssetValues(
    customerID: number,
    assetId: number,
    data: UpdateCustomFieldValuesInput
  ): Promise<CustomFieldValue[]> {
    for (const update of data.values) {
      const existingIdx = fieldValues.findIndex(
        (fv) =>
          fv.assetId === assetId && fv.definitionId === update.definitionId
      );
      if (existingIdx >= 0) {
        fieldValues[existingIdx]!.value = update.value;
      } else {
        fieldValues.push({
          assetId,
          definitionId: update.definitionId,
          value: update.value,
        });
      }
    }
    return resolveValues(customerID, assetId);
  },
};
