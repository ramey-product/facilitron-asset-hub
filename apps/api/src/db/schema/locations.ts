/**
 * Drizzle Schema — Locations (Properties & Asset Locations)
 *
 * Maps to: tblPropertyProfile, tblAssetLocations (existing SQL Server tables)
 * Multi-tenant: All queries MUST filter by customerID
 *
 * tblPropertyProfile INDEX: (CustomerID)
 * tblAssetLocations INDEX: (CustomerID)
 * tblAssetLocations INDEX: (CustomerID, PropertyID)
 */

import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

export const propertyProfile = mssqlTable('tblPropertyProfile', {
  propertyID: int('PropertyID').primaryKey(),
  customerID: int('CustomerID').notNull(),
  propertyName: nvarchar('PropertyName', { length: 255 }).notNull(),
  propertyAddress: nvarchar('PropertyAddress', { length: 500 }),
  propertyCity: nvarchar('PropertyCity', { length: 100 }),
  propertyState: nvarchar('PropertyState', { length: 50 }),
  propertyZip: nvarchar('PropertyZip', { length: 20 }),
  isActive: bit('IsActive').default(true),
});

export const assetLocations = mssqlTable('tblAssetLocations', {
  assetLocationID: int('AssetLocationID').primaryKey().identity(),
  customerID: int('CustomerID').notNull(),
  propertyID: int('PropertyID').notNull(),
  locationName: nvarchar('LocationName', { length: 255 }).notNull(),
  locationDescription: nvarchar('LocationDescription', { length: 500 }),
  buildingName: nvarchar('BuildingName', { length: 255 }),
  floorLevel: nvarchar('FloorLevel', { length: 50 }),
  roomNumber: nvarchar('RoomNumber', { length: 50 }),
  isActive: bit('IsActive').default(true),
});

export type PropertyProfile = InferSelectModel<typeof propertyProfile>;
export type NewPropertyProfile = InferInsertModel<typeof propertyProfile>;

export type AssetLocation = InferSelectModel<typeof assetLocations>;
export type NewAssetLocation = InferInsertModel<typeof assetLocations>;
