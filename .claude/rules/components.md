---
paths:
  - "apps/web/components/**"
  - "apps/web/app/**"
---

# Frontend Component Rules

## Component Organization

```
apps/web/components/
├── ui/              # shadcn/ui primitives (auto-generated, minimal edits)
├── layout/          # App-wide layout: sidebar, theme, org, providers
└── features/        # Feature-specific components grouped by domain
    ├── assets/      # Asset list, detail, wizard, hierarchy tree
    ├── dashboard/   # KPI widgets, activity feed, alert panels
    ├── settings/    # Settings forms, category managers
    ├── inventory/   # Parts, stock, vendor components
    ├── procurement/ # PO, receiving, transfer components
    └── analytics/   # Charts, reports, map components
```

## Server vs Client Components

- **Server Components** by default (no directive needed)
- Add `'use client'` ONLY when the component needs:
  - `useState`, `useEffect`, `useRef`
  - Event handlers (`onClick`, `onChange`)
  - TanStack Query hooks (`useQuery`, `useMutation`)
  - Browser APIs (`window`, `navigator`)
- Page files (`page.tsx`) should be Server Components that wrap Client Components
- Pattern: Server Component fetches initial data → passes to Client Component for interactivity

## TanStack Query Patterns

```typescript
// ✅ Good: query keys include all filter dependencies
const { data } = useQuery({
  queryKey: ['assets', { page, search, category, status }],
  queryFn: () => apiClient.assets.list({ page, search, category, status }),
  staleTime: 30_000,
});

// ✅ Good: mutations invalidate related queries
const mutation = useMutation({
  mutationFn: apiClient.assets.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['assets'] });
  },
});

// ❌ Bad: fetching in useEffect
useEffect(() => { fetch('/api/v2/assets').then(...) }, []); // Don't do this
```

## shadcn/ui Usage

- Use shadcn components for ALL standard UI patterns (Button, Card, Table, Dialog, Form, Badge, etc.)
- Install new shadcn components via `npx shadcn-ui@latest add [component]`
- Never build custom versions of components shadcn provides
- Extend shadcn components with composition, not modification

## Import Conventions

```typescript
// Shared types — always from @shared/
import type { Asset, AssetDetail } from '@shared/types/asset';

// Shared validations — always from @shared/
import { createAssetSchema } from '@shared/validations/asset';

// API client — always from lib/
import { apiClient } from '@/lib/api-client';

// UI components — from components/ui/
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Feature components — from components/features/
import { AssetTable } from '@/components/features/assets/AssetTable';
```

## File Naming

- Components: `PascalCase.tsx` (e.g., `AssetTable.tsx`, `DashboardWidget.tsx`)
- Pages: `page.tsx` (Next.js convention)
- Loading: `loading.tsx` (Next.js convention)
- Error: `error.tsx` (Next.js convention)
- Hooks: `use-kebab-case.ts` (e.g., `use-assets.ts`)
- Utils: `kebab-case.ts`

## Required Page Siblings

Every route directory must have:
- `page.tsx` — the page component
- `loading.tsx` — Suspense fallback (use Skeleton components)
- `error.tsx` — error boundary (use shadcn Alert)

## Accessibility Requirements

- All interactive elements need `aria-label` or visible label
- Keyboard navigation: Tab/Shift+Tab through controls, Enter to activate, Esc to dismiss
- Focus management: auto-focus first field in modals, return focus on close
- Color contrast: meet WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text)
- Screen reader: meaningful alt text, semantic HTML (`<nav>`, `<main>`, `<section>`)
