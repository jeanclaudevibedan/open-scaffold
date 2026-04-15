# Plans — Amendment Protocol

Plans in this directory are **immutable** once committed. When new information changes a plan's goal, constraints, or acceptance criteria, do NOT edit the plan file in place. Instead, run `./amend.sh <plan-slug>` from the repo root — it handles the mechanical parts so you can focus on the content.

## The helper (recommended path)

```bash
./amend.sh <plan-slug> [--stage] [--message "<text>"]
```

The script:

1. Autonumbers the next amendment file as `<plan-slug>-amendment-<n>.md` in this directory.
2. Scaffolds the file with the 5-section schema below (Parent / Date / Learning / New direction / Impact on acceptance criteria), filling Parent and Date automatically and leaving `TODO:` placeholders for the three content sections.
3. Appends a one-line dated entry to `MISSION.md`'s `## Changelog` section referencing the new amendment filename.
4. Optionally stages both files with `git add` when `--stage` is passed.

You then fill in the three `TODO:` sections in the amendment file, review the diff, and commit. The script refuses to run if the parent plan is missing or the mission is still unset.

## Amendment schema

- `## Parent` — the original plan slug
- `## Date` — YYYY-MM-DD
- `## Learning` — what changed and why (the "I got smarter" moment)
- `## New direction` — the revised goal or criteria, stated verbatim
- `## Impact on acceptance criteria` — which AC numbers change, how

## Read order rule

Agents and humans read `<slug>.md` first, then `<slug>-amendment-1.md`, `<slug>-amendment-2.md`, ... in numeric order. Later amendments supersede earlier ones where they conflict.

## Manual fallback

If you can't run bash for any reason, the manual flow still works: create `<plan-slug>-amendment-<n>.md` by hand using the schema above, then add a one-line entry to `MISSION.md`'s `## Changelog` section containing the amendment's basename. `verify.sh` Checks 3 and 4 enforce sequential numbering and changelog coverage either way.

Amendments are for legitimate scope evolution, not silent drift. They exist so that "I learned something new" propagates cleanly into the plan artifacts instead of living only in someone's head.

## Plan status convention

Every plan file should include a `## Status` section near the top with one of these values:

- **active** — work is in progress or not yet started
- **complete** — all acceptance criteria have been met
- **superseded** — replaced by a newer plan (note which one)

The status is the one field in a plan file that IS updated after commit (it tracks lifecycle, not scope). The handoff template includes it by default.

## The specs/ directory

The `.omc/specs/` directory holds specification artifacts produced during the Clarify phase (e.g., deep-interview outputs, research notes, domain models). Specs are reference material for plan authors — they inform plans but are not plans themselves. Keep specs lightweight; if a spec grows into actionable work, promote it to a plan file.
