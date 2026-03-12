# Session Handoff: Asset Hub Build — Phase [N]

> **Session Date:** [DATE]
> **Phase Completed:** [Phase Name]
> **Next Phase:** [Phase Name]
> **Context Budget at Handoff:** [approximate % used]

---

## Resumption Prompt

Paste this into a fresh session to resume:

```
I'm resuming the Asset Hub agentic buildout. Read these files in order:

1. `prototypes/asset-hub-v2/CLAUDE.md` — master project config
2. `prototypes/asset-hub-v2/.claude/PROJECT_MAP.md` — resource locations
3. `prototypes/asset-hub-v2/.claude/agent-log.md` — current progress
4. `prototypes/asset-hub-v2/.claude/agents/pm-orchestrator.md` — your role

Current state: Phase [N] is complete and approved. Begin Phase [N+1].

Key context from prior session:
- [Critical decision 1]
- [Critical decision 2]
- [Any pattern established that future agents must follow]
```

---

## What Was Completed This Session

### Epics Delivered
| Epic | SP | Stories | Status |
|------|----|---------|--------|
| [ID] [Name] | [SP] | [count] | ✅ Complete |

### Key Files Created/Modified
| File | What Changed |
|------|-------------|
| `apps/api/src/routes/assets.ts` | Full CRUD for assets |
| `apps/web/app/assets/page.tsx` | Asset list with search/filter |

### Architectural Decisions Made
1. [Decision] — [Rationale] — [Consequence]

### Patterns Established
1. [Pattern name] — [Where it's used] — [Why future agents must follow it]

---

## What the Next Session Must Do

### Phase [N+1] Scope
| Epic | SP | Dependencies |
|------|----|-------------|
| [ID] [Name] | [SP] | [What it needs from prior phases] |

### First Actions
1. Read the agent-log for current state
2. Read the epic files for Phase [N+1]
3. Delegate to [agent] for [task]

### Open Questions / Decisions Needed
1. [Question that couldn't be resolved in this session]

---

## Token Economics Notes

- **Estimated context per phase:** ~40-60K tokens (epic specs + agent defs + code generation)
- **Recommended handoff points:** At each phase gate (natural breakpoint, all work verified)
- **What to compact:** After handoff, the new session only needs CLAUDE.md + PROJECT_MAP.md + agent-log + the relevant phase's epic files
- **What NOT to carry forward:** Prior phase epic specs (they're done), prior code review comments, resolved issues
