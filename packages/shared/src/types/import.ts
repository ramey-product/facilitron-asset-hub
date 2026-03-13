/**
 * Bulk Import types shared between API and web app.
 * CSV/XLSX parsing happens on the frontend — API receives parsed rows as JSON.
 */

export interface ImportColumnMapping {
  sourceColumn: string;
  targetField: string;
  confidence: number; // 0-1
}

export interface ImportValidationError {
  row: number;
  field: string;
  value: string;
  message: string;
  suggestion?: string;
}

export interface ImportValidationResult {
  valid: boolean;
  totalRows: number;
  validRows: number;
  errorRows: number;
  errors: ImportValidationError[];
  preview: Record<string, unknown>[]; // first 10 rows parsed
}

export interface ImportResult {
  importId: string;
  totalRows: number;
  created: number;
  updated: number;
  failed: number;
  errors: ImportValidationError[];
  duration: number; // ms
}

export interface ImportHistoryEntry {
  id: string;
  userId: number;
  username: string;
  filename: string;
  totalRows: number;
  created: number;
  updated: number;
  failed: number;
  importedAt: string;
  duration: number;
}

export type ImportableField =
  | "equipmentName"
  | "equipmentDescription"
  | "serialNumber"
  | "equipmentBarCodeID"
  | "modelNumber"
  | "acquisitionDate"
  | "acquisitionCost"
  | "warrantyExpiration"
  | "expectedLifeYears"
  | "categoryName"
  | "propertyName"
  | "locationName"
  | "manufacturerName"
  | "parentAssetId"
  | "notes";

export interface ImportFieldDefinition {
  field: ImportableField;
  label: string;
  required: boolean;
  aliases: string[];
}

export const IMPORTABLE_FIELDS: ImportFieldDefinition[] = [
  {
    field: "equipmentName",
    label: "Asset Name",
    required: true,
    aliases: ["name", "asset name", "equipment name", "title"],
  },
  {
    field: "categoryName",
    label: "Category",
    required: true,
    aliases: ["category", "type", "asset type", "equipment type"],
  },
  {
    field: "propertyName",
    label: "Property",
    required: true,
    aliases: ["property", "site", "location", "building", "facility"],
  },
  {
    field: "serialNumber",
    label: "Serial Number",
    required: false,
    aliases: ["serial", "serial no", "serial #", "sn"],
  },
  {
    field: "equipmentBarCodeID",
    label: "Barcode/Asset Tag",
    required: false,
    aliases: ["barcode", "asset tag", "tag", "asset id"],
  },
  {
    field: "modelNumber",
    label: "Model",
    required: false,
    aliases: ["model", "model no", "model #", "model number"],
  },
  {
    field: "manufacturerName",
    label: "Manufacturer",
    required: false,
    aliases: ["manufacturer", "make", "brand", "mfg"],
  },
  {
    field: "acquisitionDate",
    label: "Purchase Date",
    required: false,
    aliases: [
      "purchase date",
      "acquired",
      "acquisition date",
      "date purchased",
    ],
  },
  {
    field: "acquisitionCost",
    label: "Purchase Cost",
    required: false,
    aliases: ["cost", "price", "purchase price", "acquisition cost"],
  },
  {
    field: "warrantyExpiration",
    label: "Warranty Expiration",
    required: false,
    aliases: ["warranty", "warranty exp", "warranty date"],
  },
  {
    field: "expectedLifeYears",
    label: "Expected Life (Years)",
    required: false,
    aliases: ["life", "lifespan", "useful life", "expected life"],
  },
  {
    field: "locationName",
    label: "Location",
    required: false,
    aliases: ["location", "room", "area", "space"],
  },
  {
    field: "equipmentDescription",
    label: "Description",
    required: false,
    aliases: ["description", "desc", "details"],
  },
  {
    field: "parentAssetId",
    label: "Parent Asset ID",
    required: false,
    aliases: ["parent", "parent id", "parent asset"],
  },
  {
    field: "notes",
    label: "Notes",
    required: false,
    aliases: ["notes", "comments", "remarks"],
  },
];
