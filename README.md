# dan-starter

A stack-agnostic GitHub template repository that front-loads project context for AI coding agents (Claude Code, Codex CLI, Antigravity Gemini) so that any agent can operate in a new project from commit #1 without re-explanation. This README describes the template itself, not any project created from it.

## Quickstart

```bash
gh repo create <your-project> --template jeanclaudevibedan/dan-starter --clone
cd <your-project>
./bootstrap.sh              # optional; creates lazy dirs + stamps MISSION.md
$EDITOR MISSION.md          # write the real mission; remove the <!-- mission:unset --> marker
$EDITOR docs/WORKFLOW.md    # skim the phase-to-tool cheat-sheet
```

Then write your first plan in `.omc/plans/<slug>.md` using the schema in `.omc/plans/handoff-template.md`, and start building.

## Core 9 files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Claude Code's native entry point (paired view of AGENTS.md). |
| `AGENTS.md` | Codex / Antigravity Gemini / other agents' entry point (paired view of CLAUDE.md). |
| `MISSION.md` | Source of truth for *what* the project is. Ships with `<!-- mission:unset -->` marker. |
| `.omc/plans/handoff-template.md` | Canonical 7-section plan schema every plan file follows. |
| `.omc/plans/README.md` | Amendment protocol in under 200 words (plans are immutable; amendments layer on top). |
| `docs/decisions/README.md` | ADR index and inline template. Ships with 2 ADRs pre-populated. |
| `docs/WORKFLOW.md` | Phase-to-tool-to-command cheat-sheet. |
| `bootstrap.sh` | Idempotent day-one setup. Creates lazy dirs, stamps MISSION.md changelog. |
| `README.md` | This file — the GitHub landing page. |

Two ADRs also ship in `docs/decisions/`: `0001-paired-views-are-duplicated-manually.md` and `0002-fifteen-minute-budget-evidence.md`. These are instances of the ADR format, not additional structural files.

## Why 9 files and not 8?

The original design called for 8 files. The 9th (`README.md`) was added on day zero via the template's own scope-evolution protocol: GitHub renders a template repo without a README as a broken landing page, which the original spec had not anticipated. Rather than silently adding the file, the change was recorded as a formal amendment to the spec — dogfooding the amendment mechanism on its own specification before any user ever sees it. The amendment protocol is documented in `.omc/plans/README.md`.

## Glossary

New to agent-orchestrated development? Here are the key terms used throughout this template:

**AC (Acceptance Criterion)** — A specific, testable statement that defines when a task is "done." Instead of vague goals like "the feature should work," an AC gives you a concrete yes/no check — for example: *"MISSION.md contains the marker `<!-- mission:unset -->`"* is verifiable with a single `grep` command. Every plan file in `.omc/plans/` includes an acceptance criteria section. If the ACs pass, the work is done. If not, it isn't.

**ADR (Architecture Decision Record)** — A short document that records a significant decision and *why* it was made. Not code — a note to future-you (or future-agents) explaining: what problem were we solving, what did we decide, and what trade-offs did we accept? ADRs live in `docs/decisions/` and follow a lightweight format (Title, Status, Context, Decision, Consequences). This template ships with two worked examples: ADR 0001 (why CLAUDE.md and AGENTS.md are manually duplicated) and ADR 0002 (the 15-minute time-budget evidence).

**Bootstrap (bootstrap.sh)** — A script you run once on day one to finish the setup that a GitHub template can't do on its own. GitHub templates copy files but can't create empty directories or stamp dates. `bootstrap.sh` handles three things: (1) creates `.omc/research/` and `.omc/state/` directories, (2) stamps today's date into MISSION.md's changelog, and (3) prints the path to `docs/WORKFLOW.md` so you know where to look first. It's idempotent (safe to run twice — the second run changes nothing) and optional (the project works without it).

## License

TBD — set by the consuming project.
