# Plans — Amendment Protocol

Plans in this directory are **immutable** once committed. When new information changes a plan's goal, constraints, or acceptance criteria, do NOT edit the plan file in place. Instead:

1. **Write an amendment file** named `<plan-slug>-amendment-<n>.md` in this directory. Amendments are numbered per-plan, starting at 1.

2. **Use the amendment schema:**
   - `## Parent` — the original plan slug
   - `## Date` — YYYY-MM-DD
   - `## Learning` — what changed and why (the "I got smarter" moment)
   - `## New direction` — the revised goal or criteria, stated verbatim
   - `## Impact on acceptance criteria` — which AC numbers change, how

3. **Add a one-line entry to `MISSION.md`'s `## Changelog` section** pointing at the amendment file.

4. **Read order rule:** agents and humans read `<slug>.md` first, then `<slug>-amendment-1.md`, `<slug>-amendment-2.md`, ... in numeric order. Later amendments supersede earlier ones where they conflict.

Amendments are for legitimate scope evolution, not silent drift. They exist so that "I learned something new" propagates cleanly into the plan artifacts instead of living only in someone's head.
