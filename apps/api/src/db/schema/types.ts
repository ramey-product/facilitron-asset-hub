/**
 * Drizzle Schema — Equipment Types, Manufacturers, and Models
 *
 * Maps to: tblEquipmentTypes, tblManufacturers (existing SQL Server tables)
 * New table: tblManufacturerModels (for P0-15 Manufacturer/Model Database)
 * Multi-tenant: All queries MUST filter by customerID
 *
 * tblEquipmentTypes INDEX: (CustomerID)
 * tblManufacturers INDEX: (CustomerID)
 * tblManufacturerModels INDEX: (customer_id, manufacturer_record_id)
 */

import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  datetime,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

export const equipmentTypes = mssqlTable('tblEquipmentTypes', {
  equipmentTypeID: int('EquipmentTypeID').primaryKey().identity(),
  customerID: int('CustomerID').notNull(),
  equipmentTypeName: nvarchar('EquipmentTypeName', { length: 255 }).notNull(),
  categorySlug: nvarchar('CategorySlug', { length: 100 }).notNull(),
  description: nvarchar('Description', { length: 500 }),
  isActive: bit('IsActive').default(true),
  sortOrder: int('SortOrder').default(0),
});

export const manufacturers = mssqlTable('tblManufacturers', {
  manufacturerRecordID: int('ManufacturerRecordID').primaryKey().identity(),
  customerID: int('CustomerID').notNull(),
  manufacturerName: nvarchar('ManufacturerName', { length: 255 }).notNull(),
  contactInfo: nvarchar('ContactInfo', { length: 500 }),
  website: nvarchar('Website', { length: 255 }),
  isActive: bit('IsActive').default(true),
});

// NEW table for P0-15 — uses snake_case column naming
export const manufacturerModels = mssqlTable('tblManufacturerModels', {
  id: int('id').primaryKey().identity(),
  manufacturerRecordId: int('manufacturer_record_id').notNull(),
  customerId: int('customer_id').notNull(),
  modelName: nvarchar('model_name', { length: 255 }).notNull(),
  modelNumber: nvarchar('model_number', { length: 100 }),
  categorySlug: nvarchar('category_slug', { length: 100 }),
  specifications: nvarchar('specifications', { length: 'max' }),
  isActive: bit('is_active').default(true),
  createdAt: datetime('created_at').notNull(),
});

export type EquipmentType = InferSelectModel<typeof equipmentTypes>;
export type NewEquipmentType = InferInsertModel<typeof equipmentTypes>;

export type Manufacturer = InferSelectModel<typeof manufacturers>;
export type NewManufacturer = InferInsertModel<typeof manufacturers>;

export type ManufacturerModel = InferSelectModel<typeof manufacturerModels>;
export type NewManufacturerModel = InferInsertModel<typeof manufacturerModels>;
