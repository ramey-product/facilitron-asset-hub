/**
 * Drizzle Schema — Asset Hierarchies
 *
 * New table for P0-05 Asset Hierarchies (parent-child equipment relationships)
 * Multi-tenant: All queries MUST filter by customer_id
 *
 * asset_hierarchies INDEX: (customer_id, equipment_record_id)
 * asset_hierarchies INDEX: (customer_id, parent_equipment_id)
 */

import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import {
  int,
  mssqlTable,
} from 'drizzle-orm/mssql-core';

export const assetHierarchies = mssqlTable('asset_hierarchies', {
  id: int('id').primaryKey().identity(),
  equipmentRecordId: int('equipment_record_id').notNull(),
  customerId: int('customer_id').notNull(),
  parentEquipmentId: int('parent_equipment_id'),
  hierarchyLevel: int('hierarchy_level').notNull().default(0),
  sortOrder: int('sort_order').default(0),
});

export type AssetHierarchy = InferSelectModel<typeof assetHierarchies>;
export type NewAssetHierarchy = InferInsertModel<typeof assetHierarchies>;
