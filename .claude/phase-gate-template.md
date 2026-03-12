# Phase Gate Review Template

> Copy this template into the agent-log when presenting a gate review.

## Gate [N]: [Phase Name] Review

### Phase Summary
- **Epics completed:** [list epic IDs + names]
- **Stories completed:** [count] / [total for this phase]
- **Story Points delivered:** [SP] / [phase total SP]

### Deliverables

#### API Endpoints Built
| Endpoint | Method | Status |
|----------|--------|--------|
| `/api/v2/...` | GET | ✅ Working |

#### Pages Built
| Page | Route | Status |
|------|-------|--------|
| Asset List | `/assets` | ✅ Working |

#### Tests
- Unit tests: [count] passing
- E2E tests: [count] passing
- Accessibility: [count] pages scanned, [count] critical violations

### Acceptance Criteria Check
For each epic in this phase, verify against the epic's AC:

#### [Epic ID: Epic Name]
- [x] AC item 1
- [x] AC item 2
- [ ] AC item 3 (note: deferred to next phase because...)

### Known Issues
1. [Issue description — severity — impact — mitigation]

### Dependencies for Next Phase
- [What the next phase needs from this phase's output]

### Session Handoff State
- **Last completed story:** [Story ID]
- **Files modified this phase:** [key files list]
- **Context to preserve:** [critical decisions, patterns established]

### Decision Needed
**Approve to proceed to Phase [N+1]?**
- [ ] Approved — proceed
- [ ] Changes requested — [specify]
- [ ] Blocked — [specify]
