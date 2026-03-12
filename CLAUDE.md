# Asset Hub — Full-Stack TypeScript Prototype

## Stack

- **Frontend**: Next.js 16 (App Router) with React 19, Server Components
- **API**: Hono (TypeScript, Node runtime)
- **ORM**: Drizzle ORM (SQL Server dialect via `drizzle-orm/mssql-core`)
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **State**: TanStack Query (React Query v5) for server state
- **Charts**: Recharts for data visualization
- **Validation**: Zod for request/response validation
- **Auth**: Mock auth middleware (cookie bridge pattern — swap to real .NET endpoint later)
- **Database**: Mock data providers matching SQL Server schema shapes (swap to real Drizzle queries later)
- **Monorepo**: pnpm workspaces + Turborepo — `apps/web`, `apps/api`, `packages/shared`
- **Testing**: Vitest (unit), Playwright (E2E)

## Project Map — Single Source of Truth for File Locations

**All agents MUST read `.claude/PROJECT_MAP.md` at the start of every task** to resolve document and resource locations. Never hardcode file paths in agent logic — always look them up from the Project Map.

When the filesystem changes, update the Project Map (not individual agent definitions).

## Ideation Is Complete

Phase 1 (Ideation) is done. The manifest at `epics/asset-hub-prototype/_manifest.md` contains 39 Epics, 162 Stories, and 710 SP — all fully specced with acceptance criteria. Agents read these specs and implement them. They do NOT create new specs.

## Core Patterns (All Agents Must Follow)

### Multi-Tenancy
- Every query filters by `customerID` (integer, from auth context)
- The Hono API injects `customerID` via auth middleware on every request
- Mock auth provides a hardcoded customerID; real auth will read from the .NET cookie bridge
- Components never query data directly — always through the API layer

### Data Access Pattern
- **Hono routes** in `apps/api/src/routes/` call **service functions**
- **Service functions** in `apps/api/src/services/` call either:
  - **Mock data providers** in `apps/api/src/db/mock/` (default — no DB required)
  - **Drizzle queries** in `apps/api/src/db/queries/` (when real DB is connected)
- A single `DATA_SOURCE` env var switches between `mock` and `drizzle`
- Services return typed responses using shared types from `packages/shared`

### API Layer (Hono)
- All routes namespaced under `/api/v2/`
- Zod middleware validates request params, query strings, and bodies
- Error responses follow a consistent `{ error: string, details?: unknown }` shape
- Pagination via `?page=1&limit=20`, returns `{ data: T[], meta: { page, limit, total } }`
- CORS configured for `http://localhost:3000` (Next.js dev)

### Frontend
- Server Components by default; `'use client'` only when interactivity is needed
- TanStack Query for all API calls from client components
- Server Components can call the API directly via internal fetch
- Use shadcn/ui primitives — don't reinvent components
- All pages need `loading.tsx` and `error.tsx` siblings

### Prototype Reuse
- The existing prototype at `../asset-hub-prototype/` has ~3,500 LOC of reusable React components
- Port components into `apps/web/` — adapt imports but preserve logic
- Replace mock data imports (`src/data/`) with TanStack Query API calls
- Keep the sidebar, theme provider, org provider patterns intact

### Security (Mock Phase)
- Mock auth context provides `{ customerID: 1, contactId: 1, username: 'demo.user', roles: ['OrderAdministrator'] }`
- Auth middleware injects this into Hono context on every request
- When swapping to real auth: middleware calls `.NET Core /api/session/validate`, caches in iron-session

## Agent Team

This project uses a coordinated 9-agent team. The **pm-orchestrator** leads execution.

### Agents (`.claude/agents/`)

| Agent | Model | Domain |
|-------|-------|--------|
| `pm-orchestrator` | opus | Phase management, delegation, checkpoint enforcement, status tracking |
| `architect` | opus | Drizzle schema, Hono API contracts, data model decisions, mock data design |
| `sr-backend` | opus | Hono routes, Drizzle queries, mock data providers, Zod validation, services |
| `frontend-lead` | opus | Complex pages, component architecture, code review, prototype porting |
| `frontend-hub` | sonnet | Dashboard, settings, condition tracking, cost display, manufacturer DB |
| `inventory-agent` | sonnet | All P1 epics: parts catalog, stock, procurement, intelligence, operations |
| `ux-designer` | opus | Component specs, interaction patterns, responsive design, accessibility |
| `devops` | sonnet | Monorepo scaffold, Turborepo config, CI/CD, build scripts, deployment |
| `qa` | sonnet | Test strategy, unit tests, integration tests, E2E tests, accessibility |

### Execution Flow (Phase-Gated)

```
PHASE 1 — Foundation (P0-00, P0-01, P0-10, P0-15)
  → devops scaffolds monorepo
  → architect designs Drizzle schema + API contracts
  → sr-backend builds Hono API + mock data + auth middleware
  → frontend-lead ports prototype components, builds app shell
  → frontend-hub builds Settings + Manufacturer DB pages (parallel)
  → qa writes foundation test suite
  → GATE 1: Human reviews Foundation phase

PHASE 2 — Core Registry (P0-04, P0-13)
  → architect extends schema for Asset Registry + Condition Tracking
  → sr-backend builds asset CRUD API + condition endpoints
  → frontend-lead builds Asset List + Detail + Create/Edit
  → frontend-hub builds Condition Tracking pages
  → qa extends test coverage
  → GATE 2: Human reviews Core Registry

PHASE 3 — Hub Experience (P0-12, P0-05, P0-09, P0-14)
  → architect designs hierarchy + dashboard data model
  → sr-backend builds dashboard API + hierarchy endpoints + status + cost
  → frontend-lead builds Asset Hierarchies (tree, drag-drop)
  → frontend-hub builds Dashboard + Online/Offline + Cost Display
  → ux-designer specs dashboard layout + widget design
  → qa extends test coverage
  → GATE 3: Human reviews Hub Experience

PHASE 4 — Data & Mobile (P0-07, P0-08, P0-11, P0-16)
  → sr-backend builds import API + document storage + scanning + FIT endpoints
  → frontend-lead builds Bulk Import wizard + Rich Records
  → frontend-hub builds Mobile Scanning + FIT Modal
  → qa extends test coverage
  → GATE 4: Human reviews Data & Mobile — P0 COMPLETE

PHASE 5 — Inventory Foundation (P1-17, P1-18, P1-22, P1-19)
  → architect designs parts catalog + stock + vendor schema
  → sr-backend builds inventory API endpoints
  → inventory-agent builds Parts Catalog, Stock Tracking, Vendor Directory, WO Consumption pages
  → qa extends test coverage
  → GATE 5: Human reviews Inventory Foundation

PHASE 6 — Procurement (P1-21, P1-23, P1-20, P1-24, P1-25)
  → sr-backend builds PO + receiving + transfer endpoints
  → inventory-agent builds Purchase Orders, PO Receiving, Reorder Alerts, Kitting, Transfers pages
  → GATE 6: Human reviews Procurement

PHASE 7 — Intelligence (P1-29 through P1-35)
  → sr-backend builds meters + downtime + TCO + depreciation + mapping endpoints
  → inventory-agent builds all intelligence/analytics pages
  → GATE 7: Human reviews Intelligence

PHASE 8 — Operations & Polish (P1-26 through P1-41)
  → inventory-agent builds remaining operations pages
  → qa runs full regression + accessibility audit
  → frontend-lead does final code review pass
  → GATE 8: Human reviews final deliverable
```

### Checkpoint Rules
- Agents work autonomously within a phase
- The pm-orchestrator MUST pause at each gate and present a status report
- Human must explicitly approve before the next phase begins
- Status is tracked in `.claude/agent-log.md`

## File Structure Convention

```
prototypes/asset-hub-v2/
├── CLAUDE.md                              # THIS FILE
├── .claude/
│   ├── PROJECT_MAP.md                     # Resource location index
│   ├── agents/                            # 9 agent definitions
│   ├── rules/                             # Coding standards
│   ├── agent-log.md                       # Running status log
│   └── phase-gate-template.md             # Gate review checklist
├── apps/
│   ├── web/                               # Next.js 16 app
│   │   ├── app/
│   │   │   ├── layout.tsx                 # Root layout (sidebar, theme, org)
│   │   │   ├── page.tsx                   # Dashboard
│   │   │   ├── assets/                    # Asset pages
│   │   │   ├── inventory/                 # Inventory pages (P1)
│   │   │   ├── procurement/               # Procurement pages (P1)
│   │   │   └── analytics/                 # Intelligence pages (P1)
│   │   ├── components/
│   │   │   ├── ui/                        # shadcn/ui primitives
│   │   │   ├── layout/                    # Sidebar, theme, org providers
│   │   │   └── features/                  # Feature-specific components
│   │   │       ├── assets/                # Asset list, detail, wizard
│   │   │       ├── dashboard/             # Dashboard widgets
│   │   │       ├── settings/              # Settings panels
│   │   │       ├── inventory/             # Inventory components
│   │   │       └── analytics/             # Charts, reports
│   │   ├── lib/
│   │   │   ├── api-client.ts              # Typed fetch wrapper for Hono API
│   │   │   ├── auth.ts                    # Mock auth context
│   │   │   ├── chart-theme.ts             # Recharts theming
│   │   │   └── utils.ts                   # CN utility
│   │   └── hooks/
│   │       ├── use-assets.ts              # TanStack Query hooks for assets
│   │       └── use-inventory.ts           # TanStack Query hooks for inventory
│   └── api/                               # Hono API
│       ├── src/
│       │   ├── index.ts                   # Hono app entry
│       │   ├── routes/
│       │   │   ├── assets.ts              # Asset CRUD
│       │   │   ├── conditions.ts          # Condition tracking
│       │   │   ├── settings.ts            # Settings/config
│       │   │   ├── manufacturers.ts       # Manufacturer/model DB
│       │   │   ├── dashboard.ts           # Dashboard aggregations
│       │   │   ├── inventory.ts           # Parts & stock (P1)
│       │   │   ├── procurement.ts         # POs, vendors (P1)
│       │   │   └── analytics.ts           # Meters, downtime, TCO (P1)
│       │   ├── services/                  # Business logic
│       │   ├── db/
│       │   │   ├── schema/                # Drizzle schema files
│       │   │   ├── queries/               # Drizzle query functions (real DB)
│       │   │   └── mock/                  # Mock data providers (default)
│       │   ├── middleware/
│       │   │   ├── auth.ts                # Mock/real auth middleware
│       │   │   ├── tenant.ts              # CustomerID injection
│       │   │   └── error-handler.ts       # Global error handler
│       │   └── types/
│       │       └── context.ts             # Hono context type extensions
│       └── drizzle.config.ts
├── packages/
│   └── shared/
│       ├── types/
│       │   ├── asset.ts                   # Asset entity types
│       │   ├── inventory.ts               # Inventory types (P1)
│       │   ├── api.ts                     # API response envelope types
│       │   └── auth.ts                    # Auth context types
│       └── validations/
│           ├── asset.ts                   # Asset Zod schemas
│           └── inventory.ts               # Inventory Zod schemas (P1)
├── e2e/                                   # Playwright E2E tests
├── package.json                           # Workspace root
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.json                          # Root TS config
```

## Code Quality

- TypeScript strict mode everywhere
- Zod schemas are the single source of truth for validation (shared between API and frontend)
- Drizzle schema maps 1:1 to existing `tbl*` column names in SQL Server
- Mock data providers return the exact same types as Drizzle queries
- All new pages need `loading.tsx`, `error.tsx`, and accessibility checks
- Reuse existing prototype components — don't rebuild what already works
