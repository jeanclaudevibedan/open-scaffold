<!-- PAIRED VIEW: this file and CLAUDE.md carry the same project facts in formats each tool reads natively. Edits here MUST be mirrored in CLAUDE.md. See docs/decisions/README.md for the rationale and drift trade-off. -->

# Agent Instructions

This project was created from [open-scaffold](https://github.com/jeanclaudevibedan/open-scaffold), a methodology template for disciplined AI development. It ships with a persistent project structure — mission definitions, immutable plans, amendment protocols, decision records, and session handover practices — so that any agent (Codex CLI, Antigravity Gemini, Claude Code, or similar) can operate in the repository from commit #1 without re-explanation.

## Layered architecture

open-scaffold has two layers. The **core methodology** (folder discipline, immutable plans, amendment protocol, ADRs, session handover) is framework-agnostic — it works with any agent or no agent at all. The **OMC/OMX-enhanced layer** adds orchestration skills (planning, autonomous execution, parallel agents, verification) that read this structure and automate the workflow. If OMC or OMX is installed, consult `docs/WORKFLOW.md` for the skill callouts alongside each development phase.

## Project facts

- **Mission source of truth:** `MISSION.md` — goals, non-goals, and changelog of scope pivots.
- **Plans directory:** `.omc/plans/` — immutable plan files organized in stage subfolders (`active/`, `backlog/`, `done/`, `blocked/`), one per task/feature slice, conforming to the 7-section schema in `.omc/plans/handoff-template.md`. The folder IS the status — see `.omc/plans/WORKFLOW.md` for movement rules.
- **Amendments:** new learnings become `<plan-slug>-amendment-<n>.md` in the same stage folder as the parent plan, scaffolded by `./amend.sh <plan-slug>`. Plans are never edited in place; amendment files and MISSION.md's changelog are never hand-written.
- **Amend helper:** `amend.sh` — run `./amend.sh <plan-slug>` to autonumber the next amendment, scaffold the 5-section schema, and stamp MISSION.md's changelog in one shot. Use `--backlog` to place in backlog instead of active.
- **Close helper:** `close.sh` — run `./close.sh <plan-slug>` to move a completed plan and its amendments to `done/` and stamp MISSION.md's changelog.
- **Quick rules:** `.omc/RULES.md` — compact non-negotiable principles. Re-read before any major action on project structure.
- **Decisions directory:** `docs/decisions/README.md` — public design-choices page. Full ADR records live internally in `.omc-dev/decisions/` and do not ship publicly.
- **Owner workspace:** `.omc-dev/` — gitignored; populated only when working on open-scaffold itself, not in cloned templates. Holds the full decision history in `plans/`, `decisions/`, `specs/`, and `snapshots/`. **Before proposing architectural changes to the scaffold itself, read `.omc-dev/plans/` and `.omc-dev/decisions/` first** — many design questions are already investigated there. Grep/Glob tools skip gitignored paths by default; include `.omc-dev/` explicitly when searching.
- **Workflow map:** `docs/WORKFLOW.md` — phase-to-tool-to-command cheat-sheet.
- **Bootstrap:** `bootstrap.sh` — optional idempotent setup; creates lazy dirs and stamps MISSION.md changelog.

## Operating rules

1. **Read `MISSION.md` before suggesting or writing code.** If it contains the marker `<!-- mission:unset -->` or the literal `TODO: define mission`, treat the mission as undefined. Redirect the user to define their mission (via `./bootstrap.sh` or direct editing) before proceeding. The user can override with an explicit instruction to skip.
2. **Every non-trivial change must trace to a plan file** in `.omc/plans/` that follows the handoff template schema.
3. **Do not edit plans in place.** If new information changes a plan's goal or acceptance criteria, run `./amend.sh <plan-slug>` — the script autonumbers the amendment file, scaffolds the 5-section schema, and stamps MISSION.md's changelog. Fill in the `TODO:` sections it leaves behind. Never hand-author amendment files, never hand-edit MISSION.md's changelog for amendments, and never modify the parent plan file.
4. **Verification traces to acceptance criteria.** Run `./verify.sh` or OMC `/verify` against the plan's acceptance criteria, not vibes.
5. **When you "get smarter"** (new information arrives that legitimately changes scope), drive the amendment flow conversationally: (a) ask the user what specifically changed and why, (b) summarize it back in their voice, (c) run `./amend.sh <plan-slug>`, (d) fill in the `TODO:` sections of the generated amendment file with their summary, (e) show them the diff for review before staging. Do not silently integrate new features; do not refuse legitimate evolution.
6. **Consult `docs/WORKFLOW.md`** when unsure which phase you're in or which tool fits the task.
7. **Run compliance checks before non-trivial code changes.** Execute `./verify.sh --quick --quiet` and check the exit code. On exit 0: proceed silently (do not mention verification). On exit 1: read the failure output, hard-block, and redirect on the first failing check. The checks use progressive disclosure: the mission check runs first; the plan check only activates after the mission is defined. If mission is undefined, redirect to defining it. If mission is defined but no plan exists, redirect to creating one. The `--quiet` flag suppresses output on success but prints failure details when something is wrong. If you cannot execute shell commands, check directly: first verify `MISSION.md` does not contain `<!-- mission:unset -->`; only if the mission is defined, then check that `.omc/plans/` and its stage subfolders (`active/`, `backlog/`, `done/`, `blocked/`) contain at least one plan file beyond the template.
8. **Detect delegation opportunities in plans.** When executing a plan from `.omc/plans/`, check for an `## Execution strategy` section. If present: read the parallel groups and dependencies, propose parallelism to the user (name specific groups and tasks), and warn if tasks marked as parallel share files or have undeclared dependencies. If absent, proceed normally — the section is optional. For setups without capable agents, `./delegate.sh <plan-path>` generates actionable terminal prompts from the Execution Strategy section.

## Scope evolution protocol

Full rules in `.omc/plans/README.md` (under 200 words). Summary: plans are immutable; amendments layer on top in numeric order; MISSION.md's changelog records every pivot; agents read the original plan plus all amendments in order. **Amendments are scaffolded mechanically by `./amend.sh <plan-slug>`** — it autonumbers the file, writes the 5-section schema (Parent / Date / Learning / New direction / Impact on acceptance criteria), and stamps MISSION.md's changelog. Agents fill in the `TODO:` sections; they never hand-author amendment files or hand-edit MISSION.md for amendment bookkeeping.

## Verification marker convention

`MISSION.md` ships with `<!-- mission:unset -->` as a machine-detectable "mission not yet defined" marker. Verification tooling (OMC `/verify`, custom scripts, code reviewers) should treat its presence as a blocker for any scope-expanding work. open-scaffold defines the marker; consuming tools decide how to honor it.
