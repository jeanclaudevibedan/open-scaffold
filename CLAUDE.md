<!-- PAIRED VIEW: this file and AGENTS.md carry the same project facts in formats each tool reads natively. Edits here MUST be mirrored in AGENTS.md. See docs/decisions/0001-paired-views-are-duplicated-manually.md for the rationale and drift trade-off. -->

# Project Context

This project was created from [open-scaffold](https://github.com/jeanclaudevibedan/open-scaffold), a methodology template for disciplined AI development. It ships with a persistent project structure — mission definitions, immutable plans, amendment protocols, decision records, and session handover practices — so that any agent can operate in this repository from commit #1 without re-explanation. Read this file first, then consult `MISSION.md` for what the project actually is.

## Layered architecture

open-scaffold has two layers. The **core methodology** (folder discipline, immutable plans, amendment protocol, ADRs, session handover) is framework-agnostic — it works with any agent or no agent at all. The **OMC/OMX-enhanced layer** adds orchestration skills (planning, autonomous execution, parallel agents, verification) that read this structure and automate the workflow. If OMC or OMX is installed, consult `docs/WORKFLOW.md` for the OMC skill callouts alongside each development phase.

## Where things live

- **`MISSION.md`** — the project's mission, goals, and non-goals. The source of truth for *what* we're building. Contains an explicit `## Changelog` section that records every scope pivot.
- **`.omc/plans/`** — plan files (one per task or feature slice). Plans are **immutable** once committed. New learnings become amendment files named `<slug>-amendment-<n>.md`. The handoff template in `.omc/plans/handoff-template.md` defines the exact 7-section schema every plan follows.
- **`docs/decisions/`** — Architecture Decision Records (ADRs). `README.md` holds the index and inline template. Ships with 2 ADRs pre-populated (`0001-paired-views-are-duplicated-manually.md`, `0002-fifteen-minute-budget-evidence.md`).
- **`docs/WORKFLOW.md`** — the phase-to-tool-to-command cheat-sheet. Where to reach for which agent/skill at each development phase.
- **`bootstrap.sh`** — optional idempotent day-one setup. Creates lazy dirs (`.omc/research/`, `.omc/state/`) and stamps MISSION.md's changelog with the bootstrap date.

## Compliance checks

Before any non-trivial code change, run `./verify.sh --quick --quiet` and check the exit code:

- **Exit 0 (all checks pass) →** Proceed silently. Do not mention verification to the user.
- **Exit 1 (any check fails) →** Read the failure output, then hard-block:
  - **Mission undefined →** Stop. Say: "Your mission isn't defined yet. Let's define it now — what is this project?" Guide the user through MISSION.md fill-in (or run `./bootstrap.sh`). Do not proceed until the mission is defined or the user explicitly says to skip.
  - **No plan file →** Stop. Say: "There's no plan for this work. Let's create one — what are you trying to build?" Create a plan in `.omc/plans/` using the handoff template. Do not proceed until a plan exists or the user explicitly says to skip.

The `--quiet` flag suppresses output when all checks pass (zero noise on success) but still prints failure details when something is wrong. The user can always override with "skip verification", "just do it", or similar. Respect their autonomy, but the default is to fix violations first.

If you cannot execute shell commands, check directly: `MISSION.md` should not contain `<!-- mission:unset -->`, and `.omc/plans/` should contain at least one `.md` file besides `README.md` and `handoff-template.md`.

## How to verify

- Run `./verify.sh` (or `./verify.sh --strict` for full compliance) to check methodology adherence. Run OMC `/verify` for acceptance-criteria tracing.
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
