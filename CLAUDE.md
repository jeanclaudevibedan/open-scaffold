<!-- PAIRED VIEW: this file and AGENTS.md carry the same project facts in formats each tool reads natively. Edits here MUST be mirrored in AGENTS.md. See docs/decisions/0001-paired-views-are-duplicated-manually.md for the rationale and drift trade-off. -->

# Project Context

This project was created from [dan-starter](https://github.com/danimal/dan-starter). It ships with a lightweight agent-orchestration layer that lets Claude Code, Codex, and Gemini operate in this repository from commit #1 without re-explanation. Read this file first, then consult `MISSION.md` for what the project actually is.

## Where things live

- **`MISSION.md`** — the project's mission, goals, and non-goals. The source of truth for *what* we're building. Contains an explicit `## Changelog` section that records every scope pivot.
- **`.omc/plans/`** — plan files (one per task or feature slice). Plans are **immutable** once committed. New learnings become amendment files named `<slug>-amendment-<n>.md`. The handoff template in `.omc/plans/handoff-template.md` defines the exact 7-section schema every plan follows.
- **`docs/decisions/`** — Architecture Decision Records (ADRs). `README.md` holds the index and inline template. Ships with 2 ADRs pre-populated (`0001-paired-views-are-duplicated-manually.md`, `0002-fifteen-minute-budget-evidence.md`).
- **`docs/WORKFLOW.md`** — the phase-to-tool-to-command cheat-sheet. Where to reach for which agent/skill at each development phase.
- **`bootstrap.sh`** — optional idempotent day-one setup. Creates lazy dirs (`.omc/research/`, `.omc/state/`) and stamps MISSION.md's changelog with the bootstrap date.

## How to verify

- Run OMC `/verify` or your preferred verification tool against the MISSION.md + most recent plan file.
- MISSION.md ships with the marker `<!-- mission:unset -->` and literal `TODO: define mission`. Verification tooling should treat the presence of either as "mission not yet defined." Remove both only when the real mission is written.
- For any feature slice, verification must trace back to the acceptance criteria in the plan file under `.omc/plans/`.

## Scope evolution protocol

Legitimate scope evolution (the "I got smarter" case — new information changes what we should build) is captured via the amendment protocol, not silent edits. The full protocol is documented in `.omc/plans/README.md` (under 200 words). Short version:

1. Plans in `.omc/plans/` are immutable once committed.
2. New learnings become `<plan-slug>-amendment-<n>.md` files in the same directory.
3. MISSION.md's `## Changelog` section gets a one-line entry per amendment.
4. Agents and humans read the original plan PLUS all amendments in numeric order.

Do NOT edit plans in place. Do NOT add features not traceable to a plan file or amendment. If a new requirement arrives, write an amendment first, then implement.

## Workflow

See `docs/WORKFLOW.md` for the phase-to-tool cheat-sheet (deep interview, planning, autopilot/ralph, ultrawork/team, `/ccg` escape hatch, Codex+OMX, Antigravity Gemini, verify, amendment capture).
