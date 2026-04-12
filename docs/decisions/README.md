# Design choices

The decisions that shaped open-scaffold and why. Every entry here is a fork in the road we explicitly chose, not a default we stumbled into. Read this if you want to understand what the scaffold *is*, not just what it does.

## The decisions

**Why CLAUDE.md and AGENTS.md are hand-duplicated instead of generated.** Because a build script that breaks in six months is worse than two files that might drift in six months. Drift you notice on the next read; a broken generator rots silently. The paired-view header in each file tells you to mirror edits, and if drift happens three times in the first year, we revisit.

**Why orchestration is agent-mediated, not runtime-native.** The plan's `Execution strategy` section is a contract for *agents*, not for runtime slash commands. The agent reads it and dispatches; the runtime just runs what it's told. This makes the scaffold portable across any runtime — OMC, Cursor, plain Claude, or a human in a terminal — without coupling the scaffold to anyone's internals.

**Why plans are immutable once committed.** Because edits silently rewrite history. Six weeks from now, you won't remember whether the plan said X all along or whether you quietly switched last Tuesday. The amendment protocol is the trade: when the world changes, write `<plan>-amendment-1.md` next to the plan, add a one-line entry to MISSION.md's changelog, and the original plan stays frozen. Slower in the moment, honest forever after.

**Why mission-first gating is the first thing `verify.sh` checks.** Because everything downstream is meaningless without it. A plan with no mission is a plan for nothing. The check exists so the very first failure mode is impossible to ignore — and so progressive disclosure can hide everything else until the mission is real.
