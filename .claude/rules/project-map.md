# Rules for All Agents — Project Map

## Read First

Every agent MUST read `.claude/PROJECT_MAP.md` at the start of every task to resolve resource locations. Never hardcode document paths in agent output, reasoning, or code — always look them up from the Project Map.

## Reference by Map Key

When referring to project resources in status updates, delegation instructions, or analysis, reference them by their **map key** (e.g., "Epic Manifest", "PoC Handoff", "P0-04 epic") — not by file path.

## Update on Change

Any agent that creates, moves, renames, or deletes a file referenced in the Project Map MUST update `.claude/PROJECT_MAP.md` to reflect the change.

## Codebase Conventions Stay in Agents

Codebase convention paths (like `apps/api/src/routes/`, `apps/web/components/ui/`) are architectural patterns, not document locations. These belong in agent definitions and coding rules — NOT in the Project Map.

## Ideation Specs Are Read-Only

The epic manifest and all story files under `epics/asset-hub-prototype/` are **read-only reference**. Agents implement these specs — they do NOT modify or create new ones. If an agent discovers that a spec is incomplete or incorrect, they flag it to the pm-orchestrator, who reports it at the next gate review.
