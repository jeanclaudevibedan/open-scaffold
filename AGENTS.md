<!-- PAIRED VIEW: this file and CLAUDE.md carry the same project facts in formats each tool reads natively. Edits here MUST be mirrored in CLAUDE.md. See docs/decisions/0001-paired-views-are-duplicated-manually.md for the rationale and drift trade-off. -->

# Agent Instructions

This project was created from [open-scaffold](https://github.com/jeanclaudevibedan/open-scaffold), a methodology template for disciplined AI development. It ships with a persistent project structure — mission definitions, immutable plans, amendment protocols, decision records, and session handover practices — so that any agent (Codex CLI, Antigravity Gemini, Claude Code, or similar) can operate in the repository from commit #1 without re-explanation.

## Layered architecture

open-scaffold has two layers. The **core methodology** (folder discipline, immutable plans, amendment protocol, ADRs, session handover) is framework-agnostic — it works with any agent or no agent at all. The **OMC/OMX-enhanced layer** adds orchestration skills (planning, autonomous execution, parallel agents, verification) that read this structure and automate the workflow. If OMC or OMX is installed, consult `docs/WORKFLOW.md` for the skill callouts alongside each development phase.

## Project facts

- **Mission source of truth:** `MISSION.md` — goals, non-goals, and changelog of scope pivots.
- **Plans directory:** `.omc/plans/` — immutable plan files, one per task/feature slice, conforming to the 7-section schema in `.omc/plans/handoff-template.md`.
- **Amendments:** new learnings become `<plan-slug>-amendment-<n>.md` in the same directory. Plans are never edited in place.
- **Decisions directory:** `docs/decisions/` — ADR index and instances. Ships with `0001-paired-views-are-duplicated-manually.md` and `0002-fifteen-minute-budget-evidence.md`.
- **Workflow map:** `docs/WORKFLOW.md` — phase-to-tool-to-command cheat-sheet.
- **Bootstrap:** `bootstrap.sh` — optional idempotent setup; creates lazy dirs and stamps MISSION.md changelog.

## Operating rules

1. **Read `MISSION.md` before suggesting or writing code.** If it contains the marker `<!-- mission:unset -->` or the literal `TODO: define mission`, treat the mission as undefined. Redirect the user to define their mission (via `./bootstrap.sh` or direct editing) before proceeding. The user can override with an explicit instruction to skip.
2. **Every non-trivial change must trace to a plan file** in `.omc/plans/` that follows the handoff template schema.
3. **Do not edit plans in place.** If new information changes a plan's goal or acceptance criteria, write an amendment file (`<slug>-amendment-<n>.md`) and add a one-line entry to `MISSION.md`'s `## Changelog` section.
4. **Verification traces to acceptance criteria.** Run `./verify.sh` or OMC `/verify` against the plan's acceptance criteria, not vibes.
5. **When you "get smarter"** (new information arrives that legitimately changes scope), use the amendment protocol. Do not silently integrate new features; do not refuse legitimate evolution.
6. **Consult `docs/WORKFLOW.md`** when unsure which phase you're in or which tool fits the task.
7. **Run compliance checks before non-trivial code changes.** Execute `./verify.sh --quick --quiet` and check the exit code. On exit 0: proceed silently (do not mention verification). On exit 1: read the failure output, hard-block, and redirect — if mission is undefined, redirect to defining it; if no plan exists, redirect to creating one. The `--quiet` flag suppresses output on success but prints failure details when something is wrong. If you cannot execute shell commands, check directly: `MISSION.md` should not contain `<!-- mission:unset -->`, and `.omc/plans/` should contain plan files beyond the template.
8. **Detect delegation opportunities in plans.** When executing a plan from `.omc/plans/`, check for an `## Execution strategy` section. If present: read the parallel groups and dependencies, propose parallelism to the user (name specific groups and tasks), and warn if tasks marked as parallel share files or have undeclared dependencies. If absent, proceed normally — the section is optional. For setups without capable agents, `./delegate.sh <plan-path>` generates actionable terminal prompts from the Execution Strategy section.

## Scope evolution protocol

Full rules in `.omc/plans/README.md` (under 200 words). Summary: plans are immutable; amendments layer on top in numeric order; MISSION.md's changelog records every pivot; agents read the original plan plus all amendments in order.

## Verification marker convention

`MISSION.md` ships with `<!-- mission:unset -->` as a machine-detectable "mission not yet defined" marker. Verification tooling (OMC `/verify`, custom scripts, code reviewers) should treat its presence as a blocker for any scope-expanding work. open-scaffold defines the marker; consuming tools decide how to honor it.
