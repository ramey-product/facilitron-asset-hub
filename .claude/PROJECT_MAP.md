# Asset Hub — Project Map

> **Single source of truth for all project resource locations.**
> All agents MUST read this file at the start of every task instead of hardcoding paths.
> When the filesystem changes, update THIS file — not individual agent definitions.
>
> Last updated: 2026-03-11

---

## How Agents Use This File

1. Every agent reads `PROJECT_MAP.md` at task start to resolve resource locations
2. Agents reference resources by their **map key** (e.g., "Epic Manifest"), not by path
3. When files move, only this map is updated — agent definitions remain untouched
4. All paths are relative to the monorepo root (`prototypes/asset-hub-v2/`)

---

## Epic Manifest & Specs (Ideation Complete — Read-Only Reference)

> **Phase 1 (Ideation) is complete.** These files are the canonical spec. Agents read them to understand scope. They do NOT create new epics or stories — they implement the ones that exist.

| Resource | Path | Description |
|----------|------|-------------|
| Epic Manifest | `../../epics/asset-hub-prototype/_manifest.md` | Master index: 39 Epics, 162 Stories, 710 SP, dependency graph, 8-phase build sequence |
| P0 Epics (14) | `../../epics/asset-hub-prototype/P0-*/epic.md` | Must-have epics with AC and story breakdown |
| P1 Epics (25) | `../../epics/asset-hub-prototype/P1-*/epic.md` | Competitive parity epics |
| All Stories | `../../epics/asset-hub-prototype/P{0,1}-*/S*.md` | Individual story files with AC, SOW, SP scores |

## Product & Strategy (Read-Only Reference)

| Resource | Path | Description |
|----------|------|-------------|
| Dev Plan | `../../docs/asset-hub-dev-plan.md` | Strategic synthesis, tech stack decision, sprint plans |
| PoC Handoff | `../../docs/asset-hub-poc-handoff.md` | Full-stack TypeScript architecture, DB schema, auth bridge |
| Session Handoff | `../../docs/SESSION-HANDOFF-asset-hub-dev-plan.md` | Context transfer doc: what was built, what's next |
| Competitive Analysis | `../../epics/asset-hub-project/Asset-Hub-Competitive-Gap-Analysis.md` | MaintainX/FMX/UpKeep benchmarking |
| Discovery Package | `../../epics/asset-hub-project/Inventory-Asset-Management-Hub-Discovery.md` | Full vision document |
| VP Strategic Direction | `../../epics/Asset Hub/Asset Hub - Feature Discovery (Jared 1-1, March 9 2026).md` | "Go full hog." Ease of use non-negotiable. |

## Existing Prototype (Port Source)

| Resource | Path | Description |
|----------|------|-------------|
| Prototype Root | `../asset-hub-prototype/` | Next.js clickable prototype (~4,800 LOC) |
| Dashboard Page | `../asset-hub-prototype/src/app/page.tsx` | 345 LOC, 90% reusable |
| Asset List | `../asset-hub-prototype/src/app/assets/page.tsx` | 280 LOC, 85% reusable |
| Asset Detail | `../asset-hub-prototype/src/app/assets/[id]/client.tsx` | 640 LOC, 75% reusable |
| Register Wizard | `../asset-hub-prototype/src/components/assets/register-asset-wizard.tsx` | 1,742 LOC, 80% reusable |
| Attachment Modal | `../asset-hub-prototype/src/components/assets/attachment-preview-modal.tsx` | 603 LOC, 70% reusable |
| Sidebar Nav | `../asset-hub-prototype/src/components/layout/sidebar.tsx` | 271 LOC, 95% reusable |
| Org Provider | `../asset-hub-prototype/src/components/layout/org-provider.tsx` | Multi-tenant context |
| Theme Provider | `../asset-hub-prototype/src/components/layout/theme-provider.tsx` | Tailwind/shadcn setup |
| Sample Data | `../asset-hub-prototype/src/data/sample-data.ts` | Mock data (~450 LOC, REPLACE with API) |
| Manufacturer DB | `../asset-hub-prototype/src/data/manufacturer-db.ts` | Demo data (200 LOC, EVOLVE into P0-15) |
| UI Components | `../asset-hub-prototype/src/components/ui/` | badge, button, card (shadcn) |
| Chart Theme | `../asset-hub-prototype/src/lib/chart-theme.ts` | Recharts theming |
| Utils | `../asset-hub-prototype/src/lib/utils.ts` | CN utility |

## Workspace Context (Read-Only Reference)

| Resource | Path | Description |
|----------|------|-------------|
| CLAUDE.md | `../../CLAUDE.md` | Workspace routing index (rules, agents, memory) |
| Prototyping Rules | `../../.claude/rules/prototyping.md` | UI prototype conventions |
| Codebase Navigation | `../../.claude/rules/codebase-navigation.md` | WORKS codebase patterns (for FIT/legacy integration) |
| Ticket Template | `../../memory/context/dev-ticket-template.md` | Epic/Story format reference |
| Glossary | `../../memory/glossary.md` | WORKS acronyms and domain terms |

## Agent Infrastructure (This Project)

| Resource | Path | Description |
|----------|------|-------------|
| Project Config | `CLAUDE.md` | Master config: stack, patterns, agent roster, checkpoints |
| Project Map | `.claude/PROJECT_MAP.md` | THIS FILE — resource location index |
| Agent Definitions | `.claude/agents/` | 9 agent role definitions |
| Coding Rules | `.claude/rules/` | File-pattern-scoped coding standards |
| Agent Log | `.claude/agent-log.md` | Running status log maintained by orchestrator |
| Phase Gate Template | `.claude/phase-gate-template.md` | Checklist template for phase reviews |

## Codebase Conventions (Structural — Not File Lookups)

> These define where code should be **written**, not where documents live.

## Layout Components (Reusable)

| Resource | Path | Description |
|----------|------|-------------|
| SidebarContext | `apps/web/src/components/layout/sidebar-context.tsx` | Shared collapsed state for primary sidebar (P1-42 S1) |
| MainContent | `apps/web/src/components/layout/main-content.tsx` | Dynamic margin wrapper responding to sidebar state (P1-42 S1) |
| CollapsibleFilterSidebar | `apps/web/src/components/layout/collapsible-filter-sidebar.tsx` | Reusable animated filter panel for any page (P1-42 S2) |

## Codebase Conventions (Structural — Not File Lookups)

| Convention | Path Pattern | Governed By |
|------------|-------------|-------------|
| Next.js Pages | `apps/web/app/` | `.claude/rules/components.md` |
| Shared UI (shadcn) | `apps/web/components/ui/` | `.claude/rules/components.md` |
| Feature Components | `apps/web/components/features/` | `.claude/rules/components.md` |
| Hono API Routes | `apps/api/src/routes/` | `.claude/rules/api-routes.md` |
| Hono Middleware | `apps/api/src/middleware/` | `.claude/rules/api-routes.md` |
| Drizzle Schema | `apps/api/src/db/schema/` | `.claude/rules/drizzle-schema.md` |
| Mock Data Providers | `apps/api/src/db/mock/` | `.claude/rules/mock-data.md` |
| Zod Validation | `packages/shared/validations/` | `.claude/rules/api-routes.md` |
| Shared Types | `packages/shared/types/` | `CLAUDE.md` |
| Tests (unit) | `**/__tests__/` | `.claude/rules/testing.md` |
| Tests (e2e) | `e2e/` | `.claude/rules/testing.md` |
