/**
 * Drizzle Schema — Asset Documents (Rich Records)
 *
 * New table for P0-08 Rich Asset Records
 * Multi-tenant: All queries MUST filter by customer_id
 *
 * asset_documents INDEX: (customer_id, equipment_record_id)
 * asset_documents INDEX: (customer_id, document_type)
 */

import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import {
  int,
  nvarchar,
  datetime,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

export const assetDocuments = mssqlTable('asset_documents', {
  id: int('id').primaryKey().identity(),
  equipmentRecordId: int('equipment_record_id').notNull(),
  customerId: int('customer_id').notNull(),
  documentName: nvarchar('document_name', { length: 255 }).notNull(),
  documentType: nvarchar('document_type', { length: 50 }).notNull(),
  filePath: nvarchar('file_path', { length: 500 }).notNull(),
  fileSizeBytes: int('file_size_bytes'),
  mimeType: nvarchar('mime_type', { length: 100 }),
  uploadedBy: int('uploaded_by').notNull(),
  uploadedAt: datetime('uploaded_at').notNull(),
});

export type AssetDocument = InferSelectModel<typeof assetDocuments>;
export type NewAssetDocument = InferInsertModel<typeof assetDocuments>;
