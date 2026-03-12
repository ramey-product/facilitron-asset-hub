/**
 * Drizzle Schema — System Settings & Asset Categories
 *
 * New tables for P0-10 Unified Settings Page
 * Multi-tenant: All queries MUST filter by customer_id
 *
 * asset_hub_settings UNIQUE: (customer_id, setting_key)
 * asset_categories INDEX: (customer_id)
 * asset_categories INDEX: (customer_id, slug)
 */

import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import {
  int,
  nvarchar,
  bit,
  datetime,
  mssqlTable,
  uniqueIndex,
} from 'drizzle-orm/mssql-core';

export const assetHubSettings = mssqlTable(
  'asset_hub_settings',
  {
    id: int('id').primaryKey().identity(),
    customerId: int('customer_id').notNull(),
    settingKey: nvarchar('setting_key', { length: 100 }).notNull(),
    settingValue: nvarchar('setting_value', { length: 'max' }).notNull(),
    updatedBy: int('updated_by'),
    updatedAt: datetime('updated_at').notNull(),
  },
  (table) => [
    uniqueIndex('uq_settings_customer_key').on(table.customerId, table.settingKey),
  ],
);

export const assetCategories = mssqlTable('asset_categories', {
  id: int('id').primaryKey().identity(),
  customerId: int('customer_id').notNull(),
  name: nvarchar('name', { length: 255 }).notNull(),
  slug: nvarchar('slug', { length: 100 }).notNull(),
  description: nvarchar('description', { length: 500 }),
  icon: nvarchar('icon', { length: 50 }),
  color: nvarchar('color', { length: 7 }),
  sortOrder: int('sort_order').default(0),
  isActive: bit('is_active').default(true),
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at'),
});

export type AssetHubSetting = InferSelectModel<typeof assetHubSettings>;
export type NewAssetHubSetting = InferInsertModel<typeof assetHubSettings>;

export type AssetCategory = InferSelectModel<typeof assetCategories>;
export type NewAssetCategory = InferInsertModel<typeof assetCategories>;
