# dan-starter

A stack-agnostic GitHub template repository that front-loads project context for AI coding agents (Claude Code, Codex CLI, Antigravity Gemini) so that any agent can operate in a new project from commit #1 without re-explanation. This README describes the template itself, not any project created from it.

## Quickstart

```bash
gh repo create <your-project> --template danimal/dan-starter --clone
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
| `.omc/plans/README.md` | <200-word amendment protocol (plans are immutable; amendments layer on top). |
| `docs/decisions/README.md` | ADR index and inline template. Ships with 2 ADRs pre-populated. |
| `docs/WORKFLOW.md` | Phase-to-tool-to-command cheat-sheet. |
| `bootstrap.sh` | Idempotent day-one setup. Creates lazy dirs, stamps MISSION.md changelog. |
| `README.md` | This file — the GitHub landing page. |

Two ADRs also ship in `docs/decisions/`: `0001-paired-views-are-duplicated-manually.md` and `0002-fifteen-minute-budget-evidence.md`. These are instances of the ADR format, not additional structural files.

## Why 9 files and not 8?

The original design called for 8 files. The 9th (`README.md`) was added on day zero via the template's own scope-evolution protocol: GitHub renders a template repo without a README as a broken landing page, which the original spec had not anticipated. Rather than silently adding the file, the change was recorded as an amendment to the spec — [dogfooding the amendment mechanism on its own specification before any user ever sees it](./.omc/specs/deep-interview-dan-starter-amendment-1.md). The amendment protocol is documented in `.omc/plans/README.md`; its first three worked examples live in `.omc/specs/` in any project instantiated from dan-starter's source repo.

## License

TBD — set by the consuming project.
