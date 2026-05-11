<!-- PAIRED VIEW: this file and AGENTS.md carry the same project facts in formats each tool reads natively. Edits here MUST be mirrored in AGENTS.md. See docs/decisions/README.md for the rationale and drift trade-off. -->

# Project Context

This project is [open-scaffold](https://github.com/jeanclaudevibedan/open-scaffold), a runtime-neutral repo-native operating system for agent-orchestrated development. It ships with a persistent project structure — mission, roadmap, immutable plans, amendment protocols, decisions, evidence, run packets, and session handover practices — so that any agent or orchestrator can operate in this repository from commit #1 without re-explanation. Read this file first, then consult `MISSION.md` for what the project actually is.

## Layered architecture

open-scaffold has multiple layers. The **core system** is framework-agnostic repo discipline: mission, roadmap, plans, amendments, evidence, run packets, operator reports, and handover. **Orchestrators/agents** such as Hermes, Claw/OpenClaw, Claude Code, Codex, and Gemini can operate against that substrate. **Runtime harnesses** such as OMC and OMX extend Claude Code/Codex with workflow modes; they are not equivalent to orchestrators like Hermes or Claw. Consult `docs/OPEN_SCAFFOLD_SYSTEM.md` for the ontology and `docs/WORKFLOW.md` for phase guidance.

## Where things live

- **`MISSION.md`** — the project's mission, goals, and non-goals. The source of truth for *what* we're building. Contains an explicit `## Changelog` section that records every scope pivot.
- **`ROADMAP.md`** — product/system milestones and the self-dogfood chain from roadmap item to issue/task, plan, run packet, PR, and release note.
- **`docs/OPEN_SCAFFOLD_SYSTEM.md`** — boundary map for Open Scaffold core, orchestrators/agents, OMC/OMX runtime harnesses, task bridges, glass-cockpit surfaces, and GitHub.
- **`.osc/plans/`** — plan files organized in stage subfolders (`active/`, `backlog/`, `done/`, `blocked/`). The folder IS the status. Plans are **immutable** once committed. New learnings become amendment files named `<slug>-amendment-<n>.md` in the same stage folder as the parent. The handoff template in `.osc/plans/handoff-template.md` defines the exact 7-section schema every plan follows. See `.osc/plans/WORKFLOW.md` for movement rules between stage folders.
- **`docs/decisions/`** — `README.md` is the public design-choices page (paired views, immutable plans, adapter-mediated orchestration). The full ADR records that back these decisions live internally in `.osc-dev/decisions/` and do not ship with the public template.
- **`.osc-dev/`** (gitignored; populated only when working on open-scaffold itself, not in cloned templates) — owner's internal workspace holding `plans/`, `decisions/` (full ADR records), `specs/`, and `snapshots/`. **Before proposing architectural changes to the scaffold itself, read `.osc-dev/plans/` and `.osc-dev/decisions/` first** — many design questions are already investigated there, and re-deriving a rejected decision wastes a session. Grep/Glob tools skip gitignored paths by default; include `.osc-dev/` explicitly when searching.
- **`docs/WORKFLOW.md`** — the phase-to-tool-to-command cheat-sheet. Where to reach for which agent/skill at each development phase.
- **`bootstrap.sh`** — optional idempotent day-one setup. Creates lazy dirs (`.osc/research/`, `.osc/state/`) and stamps MISSION.md's changelog with the bootstrap date.
- **`amend.sh`** — amendment scaffolder. Run `./amend.sh <plan-slug>` to autonumber the next amendment, scaffold the 5-section schema, and stamp MISSION.md's changelog in one shot. Use `--backlog` to place in backlog instead of active. Use this instead of hand-editing amendment files or MISSION.md.
- **`close.sh`** — plan closer. Run `./close.sh <plan-slug>` to move a completed plan and all its amendments to `done/` and stamp MISSION.md's changelog.
- **`.osc/RULES.md`** — compact non-negotiable principles. Re-read before any major action on project structure.

## Compliance checks

Before any non-trivial code change, run `./verify.sh --quick --quiet` and check the exit code:

- **Exit 0 (all checks pass) →** Proceed silently. Do not mention verification to the user.
- **Exit 1 (any check fails) →** Read the failure output, then hard-block on the first failing check:
  - **Mission undefined →** Stop. Say: "Your mission isn't defined yet. Let's define it now — what is this project?" Guide the user through MISSION.md fill-in (or run `./bootstrap.sh`). Do not proceed until the mission is defined or the user explicitly says to skip. Note: the plan check is gated behind the mission check — it will not appear until the mission is defined (progressive disclosure).
  - **No plan file →** (only appears after mission is defined) Stop. Say: "There's no plan for this work. Let's create one — what are you trying to build?" Create a plan in `.osc/plans/` using the handoff template. Do not proceed until a plan exists or the user explicitly says to skip.

The `--quiet` flag suppresses output when all checks pass (zero noise on success) but still prints failure details when something is wrong. The user can always override with "skip verification", "just do it", or similar. Respect their autonomy, but the default is to fix violations first.

If you cannot execute shell commands, check directly: first check that `MISSION.md` does not contain `<!-- mission:unset -->`. Only if the mission is defined, then check that `.osc/plans/` and its stage subfolders (`active/`, `backlog/`, `done/`, `blocked/`) contain at least one `.md` plan file besides `README.md` and `handoff-template.md`.

## How to verify

- Run `./verify.sh` (or `./verify.sh --strict` for full compliance) to check methodology adherence. Runtime harness handoffs may wrap verification, but acceptance-criteria evidence and `./verify.sh` remain the source of truth.
- MISSION.md ships with the marker `<!-- mission:unset -->` and literal `TODO: define mission`. Verification tooling should treat the presence of either as "mission not yet defined." Remove both only when the real mission is written.
- For any feature slice, verification must trace back to the acceptance criteria in the plan file under `.osc/plans/`.

## Scope evolution protocol

Legitimate scope evolution (the "I got smarter" case — new information changes what we should build) is captured via the amendment protocol, not silent edits. The full protocol is documented in `.osc/plans/README.md` (under 200 words). Short version:

1. Plans in `.osc/plans/` are immutable once committed.
2. New learnings become `<plan-slug>-amendment-<n>.md` files in the same stage folder as the parent — **scaffolded by `./amend.sh <plan-slug>`**, not hand-written.
3. MISSION.md's `## Changelog` section gets a one-line entry per amendment — **stamped by `amend.sh`**, not hand-edited.
4. Agents and humans read the original plan PLUS all amendments in numeric order.

Do NOT edit plans in place. Do NOT hand-edit amendment files or MISSION.md's changelog for amendment bookkeeping — let `amend.sh` do the mechanical work. Do NOT add features not traceable to a plan file or amendment. If a new requirement arrives, write an amendment first, then implement.

### Agent-driven amendment flow

When the user signals an "I got smarter" moment (new information changes a plan's goal, constraints, or acceptance criteria), drive the amendment conversationally:

1. Ask the user what specifically changed since the plan was written and why it changes scope. Summarize their words back in their voice before writing anything.
2. Run `./amend.sh <plan-slug>` from the repo root. The script autonumbers the amendment, scaffolds the 5-section schema (Parent / Date / Learning / New direction / Impact on acceptance criteria), and stamps MISSION.md's changelog.
3. Fill in the three `TODO:` sections in the new amendment file using the user's summary. Do not touch MISSION.md directly — the script already stamped it.
4. Show the user the diff of the new amendment file and the MISSION.md changelog line for review before staging. Pass `--stage` on a rerun, or stage manually after they approve.
5. Never hand-author amendment files, never manually edit MISSION.md's changelog for amendments, and never modify the parent plan file.

## Delegation detection

When executing a plan from `.osc/plans/`, check whether it contains an `## Execution strategy` section. If present:

1. **Read the parallel groups and dependencies.** Identify which tasks can run concurrently and which must wait for prerequisites.
2. **Propose delegation to the user:**
   - **With OMC harness:** Suggest Claude Code/OMC workflows such as `/team`, `/ultrawork`, or `/ralph` for suitable groups. Name the groups and tasks explicitly.
   - **With OMX harness:** Suggest Codex/OMX workflows such as `$team`, `$ralph`, `$ultrawork`, or `$ralplan`, promoting runtime evidence back into the scaffold chain.
   - **Without a runtime harness:** Describe the parallelism opportunity in plain text (e.g., "Tasks T1 and T5 are independent and could be run in separate sessions"). The user decides how to act on it.
3. **Warn on risky parallelization.** If tasks marked as parallel in the Execution Strategy share files listed in the plan's "Files to touch" section, or if a task's dependency is in the same parallel group, flag the conflict before proceeding.

If the plan has no Execution Strategy section, proceed normally — the section is optional and only present for multi-agent or parallel work.

For users without a capable agent (local LLMs, manual workflows), the `./delegate.sh <plan-path>` script reads the Execution Strategy section and generates actionable prompts that can be pasted into separate terminal sessions.

## Workflow

See `docs/WORKFLOW.md` for the phase-to-tool cheat-sheet (deep interview, planning, OMC `/ralph`/`/team`, OMX `$ralph`/`$team`, adapter handoffs, verify, amendment capture).
