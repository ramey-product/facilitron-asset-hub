/**
 * Drizzle Schema — Equipment (Core Asset Table)
 *
 * Maps to: tblEquipment (existing SQL Server table)
 * Multi-tenant: All queries MUST filter by customerID
 *
 * INDEX: (CustomerID)
 * INDEX: (CustomerID, PropertyID)
 * INDEX: (CustomerID, EquipmentTypeID)
 * INDEX: (CustomerID, LifecycleStatus)
 * INDEX: (EquipmentBarCodeID)
 */

import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  datetime,
  decimal,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

// -----------------------------------------------------------------------------
// tblEquipment — Primary asset/equipment table (EXISTING)
// Preserves original SQL Server column names exactly
// -----------------------------------------------------------------------------
export const equipment = mssqlTable('tblEquipment', {
  equipmentRecordID: int('EquipmentRecordID').primaryKey().identity(),
  customerID: int('CustomerID').notNull(),
  propertyID: int('PropertyID'),
  assetLocationID: int('AssetLocationID'),
  equipmentName: nvarchar('EquipmentName', { length: 255 }).notNull(),
  equipmentDescription: nvarchar('EquipmentDescription', { length: 2000 }),
  equipmentTypeID: int('EquipmentTypeID'),
  serialNumber: nvarchar('SerialNumber', { length: 100 }),
  equipmentBarCodeID: nvarchar('EquipmentBarCodeID', { length: 100 }),
  manufacturerRecordID: int('ManufacturerRecordID'),
  modelNumber: nvarchar('ModelNumber', { length: 100 }),
  acquisitionDate: datetime('AcquisitionDate'),
  acquisitionCost: decimal('AcquisitionCost', { precision: 18, scale: 2 }),
  warrantyExpiration: datetime('WarrantyExpiration'),
  expectedLifeYears: int('ExpectedLifeYears'),
  lifecycleStatus: nvarchar('LifecycleStatus', { length: 50 }).default('Active'),
  conditionRating: int('ConditionRating'),
  lastConditionDate: datetime('LastConditionDate'),
  isActive: bit('IsActive').default(true),
  dateCreated: datetime('DateCreated').notNull(),
  dateModified: datetime('DateModified'),
  createdBy: int('CreatedBy'),
  modifiedBy: int('ModifiedBy'),
  notes: nvarchar('Notes', { length: 'max' }),
});

export type Equipment = InferSelectModel<typeof equipment>;
export type NewEquipment = InferInsertModel<typeof equipment>;
