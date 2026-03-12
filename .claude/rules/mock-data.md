---
paths:
  - "apps/api/src/db/mock/**"
---

# Mock Data Provider Rules

## Purpose

Mock data providers are the **default data layer** for the Asset Hub prototype. They return typed data matching the exact shapes that Drizzle queries would return, enabling the full frontend to work without a database connection.

## Provider Interface Pattern

Every entity needs a provider interface that both mock and Drizzle implementations satisfy:

```typescript
// apps/api/src/types/providers.ts
export interface AssetProvider {
  list(customerID: number, query: ListAssetsQuery): Promise<PaginatedResult<Asset>>;
  getById(customerID: number, id: number): Promise<Asset | null>;
  create(customerID: number, contactId: number, data: CreateAssetInput): Promise<Asset>;
  update(customerID: number, id: number, contactId: number, data: UpdateAssetInput): Promise<Asset | null>;
  delete(customerID: number, id: number): Promise<boolean>;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
```

## Seed Data Requirements

- **20+ records** per primary entity (assets, parts, vendors)
- **3-5 records** per reference entity (types, categories, conditions)
- **Realistic Facilitron domain data**: HVAC units, generators, fire panels, elevators, plumbing fixtures
- **Multiple categories**: HVAC, Electrical, Plumbing, Fire Safety, Structural, Grounds
- **Multiple lifecycle stages**: Procurement, Active, UnderMaintenance, Flagged, Decommissioned
- **Multiple properties/locations**: simulating a multi-site customer with 3-5 properties
- **Variety in conditions**: from Excellent to Critical across the asset set
- **Cost data**: realistic purchase prices, maintenance costs, labor hours

## Seed Data Organization

```
apps/api/src/db/mock/data/
├── assets.ts           # 25+ equipment records
├── locations.ts        # 5 properties with 15+ locations
├── types.ts            # 8-10 equipment types
├── conditions.ts       # 5 condition scales
├── manufacturers.ts    # 15+ manufacturers with product lines
├── condition-logs.ts   # 50+ historical condition entries
├── work-orders.ts      # 30+ linked work orders
├── inventory.ts        # 40+ parts and supplies (P1)
├── vendors.ts          # 10+ vendors (P1)
└── purchase-orders.ts  # 15+ POs in various states (P1)
```

## Switchable Data Source

The service layer uses an environment variable to choose the provider:

```typescript
// apps/api/src/services/asset-service.ts
import { mockAssetProvider } from '../db/mock/assets';
import { drizzleAssetProvider } from '../db/queries/assets';

const getProvider = (): AssetProvider => {
  return process.env.DATA_SOURCE === 'drizzle'
    ? drizzleAssetProvider
    : mockAssetProvider;
};
```

**One env var, zero code changes.** When a real DB connection is available:
1. Set `DATA_SOURCE=drizzle`
2. Set `DATABASE_URL=mssql://...`
3. Everything else stays the same

## Rules

1. **Type parity** — mock providers return the EXACT same TypeScript types as Drizzle queries
2. **CustomerID filtering** — every mock provider filters by customerID (simulate multi-tenancy)
3. **Pagination** — list providers support page/limit and return meta with total counts
4. **Realistic data** — use actual Facilitron equipment names, property names, trade categories
5. **Seed data is immutable** — mock providers can do in-memory mutations for create/update/delete during a session, but seed data files don't change
6. **No database dependency** — mock providers work with zero configuration, zero network
