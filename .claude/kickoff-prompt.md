# Asset Hub Build — Kickoff Prompt

> Paste this into a fresh Claude Code session to start the agentic buildout.

```
## Context

I'm Matt Ramey, PM at Facilitron. We're building the Asset Hub — a full-stack TypeScript prototype that implements 39 Epics (162 Stories, 710 SP) for our maintenance asset management system.

**Ideation is complete.** All epics and stories are specced with acceptance criteria. Your job is to EXECUTE the build, not design it.

## Setup

Read these files in this exact order:

1. `prototypes/asset-hub-v2/CLAUDE.md` — master project config (stack, patterns, agent roster, execution flow)
2. `prototypes/asset-hub-v2/.claude/PROJECT_MAP.md` — resource location index
3. `prototypes/asset-hub-v2/.claude/agents/pm-orchestrator.md` — your role definition
4. `epics/asset-hub-prototype/_manifest.md` — master epic index with dependency graph

## Your Mission

You are the **pm-orchestrator**. Execute Phase 1 (Foundation) of the 8-phase build:

### Phase 1 Scope
- **P0-00** TypeScript Foundation (29 SP, 6 stories)
- **P0-01** Auth Bridge (15 SP, 5 stories)
- **P0-10** Unified Settings (21 SP, 5 stories)
- **P0-15** Manufacturer/Model DB (16 SP, 5 stories)

### Execution Order
1. Delegate to `devops` → scaffold the pnpm monorepo (P0-00/S1)
2. Delegate to `architect` → design Drizzle schema for equipment + settings + manufacturers (P0-00/S2)
3. Delegate to `sr-backend` → build Hono API core + mock auth + mock data providers (P0-00/S3, P0-01)
4. Delegate to `frontend-lead` → port prototype components into monorepo app shell (P0-00/S4)
5. Delegate to `frontend-hub` → build Settings page (P0-10) + Manufacturer DB (P0-15) in parallel
6. Delegate to `devops` → CI/CD pipeline + deployment config (P0-00/S5, S6)
7. Delegate to `qa` → foundation test suite
8. Present Gate 1 review using `.claude/phase-gate-template.md`

### Key Constraints
- Build against mock data (DATA_SOURCE=mock) — no real database
- Port existing prototype components from `../asset-hub-prototype/` — don't rebuild
- Every epic has acceptance criteria — verify against them before marking complete
- Pause at Gate 1 for my approval before starting Phase 2

### Coding Rules
Read the rule files in `.claude/rules/` before writing code. Key rules:
- `components.md` — React/Next.js patterns
- `api-routes.md` — Hono API patterns
- `drizzle-schema.md` — schema mapping conventions
- `mock-data.md` — mock data provider patterns

Go.
```
