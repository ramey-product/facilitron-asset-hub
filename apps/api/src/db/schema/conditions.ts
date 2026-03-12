/**
 * Drizzle Schema — Condition Tracking
 *
 * Maps to: tblEquipmentConditions (existing SQL Server table)
 * New table: asset_condition_logs (condition change audit trail)
 * Multi-tenant: All queries MUST filter by customerID
 *
 * tblEquipmentConditions INDEX: (CustomerID)
 * asset_condition_logs INDEX: (customer_id, equipment_record_id)
 * asset_condition_logs INDEX: (customer_id, logged_at)
 */

import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  datetime,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

export const equipmentConditions = mssqlTable('tblEquipmentConditions', {
  conditionID: int('ConditionID').primaryKey().identity(),
  customerID: int('CustomerID').notNull(),
  conditionName: nvarchar('ConditionName', { length: 100 }).notNull(),
  conditionScore: int('ConditionScore').notNull(),
  colorCode: nvarchar('ColorCode', { length: 7 }),
  isActive: bit('IsActive').default(true),
});

// NEW table — condition change audit trail
export const assetConditionLogs = mssqlTable('asset_condition_logs', {
  id: int('id').primaryKey().identity(),
  equipmentRecordId: int('equipment_record_id').notNull(),
  customerId: int('customer_id').notNull(),
  conditionScore: int('condition_score').notNull(),
  previousScore: int('previous_score'),
  notes: nvarchar('notes', { length: 2000 }),
  loggedBy: int('logged_by').notNull(),
  loggedAt: datetime('logged_at').notNull(),
});

export type EquipmentCondition = InferSelectModel<typeof equipmentConditions>;
export type NewEquipmentCondition = InferInsertModel<typeof equipmentConditions>;

export type AssetConditionLog = InferSelectModel<typeof assetConditionLogs>;
export type NewAssetConditionLog = InferInsertModel<typeof assetConditionLogs>;
