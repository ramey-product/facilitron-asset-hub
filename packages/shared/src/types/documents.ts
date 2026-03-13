/**
 * Rich Asset Records types: photos, documents, custom fields.
 * P0-08 feature set.
 */

export interface AssetPhoto {
  id: number;
  assetId: number;
  filename: string;
  url: string;
  thumbnailUrl: string;
  mimeType: string;
  sizeBytes: number;
  isPrimary: boolean;
  caption?: string;
  uploadedAt: string;
  uploadedBy: number;
}

export interface AssetDocument {
  id: number;
  assetId: number;
  filename: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  documentType: "manual" | "warranty" | "inspection" | "invoice" | "other";
  description?: string;
  uploadedAt: string;
  uploadedBy: number;
}

export type DocumentType = AssetDocument["documentType"];

export interface CustomFieldDefinition {
  id: number;
  customerID: number;
  fieldName: string;
  fieldLabel: string;
  fieldType: "text" | "number" | "date" | "select" | "boolean";
  options?: string[]; // for select type
  isRequired: boolean;
  displayOrder: number;
  isActive: boolean;
}

export type CustomFieldType = CustomFieldDefinition["fieldType"];

export interface CustomFieldValue {
  definitionId: number;
  fieldName: string;
  fieldLabel: string;
  fieldType: string;
  value: string | number | boolean | null;
}

export interface CreatePhotoInput {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  caption?: string;
}

export interface CreateDocumentInput {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  documentType: DocumentType;
  description?: string;
}

export interface CreateCustomFieldDefinitionInput {
  fieldName: string;
  fieldLabel: string;
  fieldType: CustomFieldType;
  options?: string[];
  isRequired?: boolean;
  displayOrder?: number;
}

export interface UpdateCustomFieldDefinitionInput {
  fieldLabel?: string;
  fieldType?: CustomFieldType;
  options?: string[];
  isRequired?: boolean;
  displayOrder?: number;
}

export interface UpdateCustomFieldValuesInput {
  values: { definitionId: number; value: string | number | boolean | null }[];
}
