---
paths:
  - "apps/api/src/db/**"
---

# Drizzle ORM Schema Rules

## Schema Organization

```
apps/api/src/db/
├── schema/
│   ├── equipment.ts        # tblEquipment, tblEquipmentHistory
│   ├── locations.ts        # tblAssetLocations, tblPropertyProfile
│   ├── conditions.ts       # tblEquipmentConditions + new condition logs
│   ├── types.ts            # tblEquipmentTypes, tblManufacturers
│   ├── workorders.ts       # tblWorkOrderEquipment junction
│   ├── settings.ts         # System settings tables
│   ├── inventory.ts        # Parts, stock, vendors (P1)
│   ├── procurement.ts      # POs, receiving, transfers (P1)
│   └── index.ts            # Re-exports all schemas
├── queries/                # Drizzle query functions (real DB)
│   ├── assets.ts
│   ├── conditions.ts
│   └── ...
├── mock/                   # Mock data providers (default)
│   ├── data/               # Seed data JSON/TS files
│   ├── assets.ts           # Mock asset provider
│   ├── conditions.ts       # Mock condition provider
│   └── ...
└── index.ts                # DB connection factory
```

## Schema Mapping Convention

Map existing SQL Server tables using Drizzle's MSSQL dialect:

```typescript
import { int, nvarchar, bit, datetime, decimal, sqlTable } from 'drizzle-orm/mssql-core';

// EXISTING tables: preserve original tbl* names and column names exactly
export const equipment = sqlTable('tblEquipment', {
  // TypeScript field: camelCase
  // SQL column: original name (passed to column constructor)
  equipmentRecordID: int('EquipmentRecordID').primaryKey().autoincrement(),
  customerID: int('CustomerID').notNull(),
  propertyID: int('PropertyID'),
  equipmentName: nvarchar('EquipmentName', { length: 255 }),
  // ...
});

// NEW tables: use modern snake_case naming
export const assetConditionLog = sqlTable('asset_condition_logs', {
  id: int('id').primaryKey().autoincrement(),
  equipmentRecordID: int('equipment_record_id').notNull(),
  customerID: int('customer_id').notNull(),
  conditionScore: int('condition_score').notNull(),
  notes: nvarchar('notes', { length: 2000 }),
  loggedBy: int('logged_by').notNull(),
  loggedAt: datetime('logged_at').notNull(),
});
```

## Rules

1. **Preserve legacy names** — existing `tbl*` tables keep their exact column names in Drizzle mapping
2. **New tables use snake_case** — for tables we create (condition logs, documents, custom fields)
3. **CustomerID everywhere** — every table must have a customerID column for multi-tenant filtering
4. **No migrations yet** — for the prototype, we define schemas for type safety but don't run migrations against the real DB
5. **Schema = contract** — the Drizzle schema defines the types that mock providers must match
6. **Index comments** — add `// INDEX: (CustomerID, ColumnName)` comments for important indexes

## Type Export Pattern

```typescript
// apps/api/src/db/schema/equipment.ts
import { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export type Equipment = InferSelectModel<typeof equipment>;
export type NewEquipment = InferInsertModel<typeof equipment>;
```

These types flow to `packages/shared/types/` for frontend consumption.
