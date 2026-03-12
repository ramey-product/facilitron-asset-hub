---
paths:
  - "apps/api/**"
  - "packages/shared/validations/**"
---

# Hono API Route Rules

## Route Organization

```
apps/api/src/routes/
├── assets.ts          # GET/POST/PUT/DELETE /api/v2/assets
├── conditions.ts      # GET/POST /api/v2/assets/:id/conditions
├── settings.ts        # GET/PUT /api/v2/settings/*
├── manufacturers.ts   # GET/POST /api/v2/manufacturers
├── dashboard.ts       # GET /api/v2/dashboard/*
├── hierarchies.ts     # GET/POST/PUT/DELETE /api/v2/hierarchies
├── documents.ts       # GET/POST/DELETE /api/v2/assets/:id/documents
├── import.ts          # POST /api/v2/import/*
├── inventory.ts       # /api/v2/inventory/* (P1)
├── procurement.ts     # /api/v2/procurement/* (P1)
└── analytics.ts       # /api/v2/analytics/* (P1)
```

## Route Handler Pattern

```typescript
import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import type { AppEnv } from '../types/context';

const feature = new Hono<AppEnv>();

// List with pagination + filters
feature.get('/', zValidator('query', listSchema), async (c) => {
  const query = c.req.valid('query');
  const { customerID } = c.get('auth');
  const result = await featureService.list(customerID, query);
  return c.json({ data: result.items, meta: result.meta });
});

// Single by ID
feature.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'));
  const { customerID } = c.get('auth');
  const item = await featureService.getById(customerID, id);
  if (!item) return c.json({ error: 'Not found' }, 404);
  return c.json({ data: item });
});

// Create
feature.post('/', zValidator('json', createSchema), async (c) => {
  const body = c.req.valid('json');
  const { customerID, contactId } = c.get('auth');
  const item = await featureService.create(customerID, contactId, body);
  return c.json({ data: item }, 201);
});

// Update
feature.put('/:id', zValidator('json', updateSchema), async (c) => {
  const id = parseInt(c.req.param('id'));
  const body = c.req.valid('json');
  const { customerID, contactId } = c.get('auth');
  const item = await featureService.update(customerID, id, contactId, body);
  if (!item) return c.json({ error: 'Not found' }, 404);
  return c.json({ data: item });
});

export { feature };
```

## Response Envelope

All responses follow these shapes:

```typescript
// Success (single)
{ data: T }

// Success (list with pagination)
{ data: T[], meta: { page: number, limit: number, total: number, totalPages: number } }

// Error
{ error: string, details?: unknown }
```

## Zod Validation

Validation schemas live in `packages/shared/validations/` and are shared between API and frontend.

```typescript
// packages/shared/validations/asset.ts
import { z } from 'zod';

export const listAssetsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  locationId: z.coerce.number().int().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

export const createAssetSchema = z.object({
  equipmentName: z.string().min(1).max(255),
  categorySlug: z.string().min(1),
  propertyID: z.number().int(),
  assetLocationID: z.number().int().optional(),
  description: z.string().max(2000).optional(),
  manufacturerRecordID: z.number().int().optional(),
  serialNumber: z.string().max(100).optional(),
  equipmentBarCodeID: z.string().max(100).optional(),
  acquisitionDate: z.string().datetime().optional(),
  // ... extend per epic AC
});

export type ListAssetsQuery = z.infer<typeof listAssetsSchema>;
export type CreateAssetInput = z.infer<typeof createAssetSchema>;
```

## Middleware Stack

Applied in order on every request:
1. `error-handler` — catches unhandled errors, returns `{ error }` envelope
2. `cors` — allows requests from `CORS_ORIGIN` env var
3. `auth` — injects `{ customerID, contactId, username, roles }` into Hono context
4. `tenant` — (optional) validates customerID exists and is active

## Naming Conventions

- Route files: `kebab-case.ts`
- Service files: `kebab-case-service.ts`
- Provider files: `kebab-case-provider.ts`
- Zod schemas: `camelCaseSchema` (e.g., `createAssetSchema`)
- API paths: `/api/v2/kebab-case` (e.g., `/api/v2/purchase-orders`)

## Rules

1. **Zod validate everything** — never trust raw params, query strings, or bodies
2. **CustomerID on every query** — multi-tenant isolation is non-negotiable
3. **Service layer abstraction** — routes call services, services call providers
4. **Consistent error responses** — `{ error: string }` on every failure path
5. **Pagination by default** — never return unbounded lists
6. **No business logic in routes** — routes validate input + call services + return output
