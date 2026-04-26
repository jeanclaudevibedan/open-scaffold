# Open Scaffold — Rules (Quick Reference)

Re-read this file before any major action on project structure.

## Non-Negotiables

1. **Mission first.** Read `MISSION.md` before doing anything. If `<!-- mission:unset -->` is present, stop and define the mission.
2. **Plans are immutable.** Never edit a plan file after creation. New info → `./amend.sh <slug>`.
3. **Amendments are mechanical.** Never hand-write amendment files or changelog entries. Use `./amend.sh`.
4. **Folder = status.** Plans live in `active/`, `backlog/`, `done/`, or `blocked/`. Move files, don't rename them. See `.osc/plans/WORKFLOW.md`.
5. **Verify before claiming done.** Run `./verify.sh` against acceptance criteria. Use `./close.sh` to move plans to `done/`.
6. **Check active/ first.** Before starting new work, check `.osc/plans/active/`. Continue in-flight work unless told otherwise.
7. **Scope changes go through amendments.** Ask the user what changed, summarize, run `./amend.sh`, fill TODOs, show diff.
8. **One focus at a time.** Keep `active/` small (2–3 plans max). Finish or park before pulling from `backlog/`.

## File Conventions

- Plan files: `NNN-slug.md` (number is permanent ID, never changes)
- Amendments: `NNN-slug-amendment-N.md` (stays with parent plan in same folder)
- All plans follow the 7-section schema in `.osc/plans/handoff-template.md`

## When In Doubt

- Structure questions → re-read this file and `.osc/plans/WORKFLOW.md`
- Phase/tool questions → `docs/WORKFLOW.md`
- Design rationale → `docs/decisions/README.md`
