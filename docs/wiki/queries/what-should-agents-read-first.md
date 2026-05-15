---
title: What should agents read first?
created: 2026-05-15
updated: 2026-05-15
type: query
tags: [open-scaffold, agent-orchestration, workflow, source-of-truth]
sources: [AGENTS.md, MISSION.md, ROADMAP.md, .osc/RULES.md]
confidence: high
contested: false
---

# What should agents read first?

An agent entering an Open Scaffold repository should read the smallest set of files that establishes mission, current direction, rules, and bounded work.

Recommended order:

1. `MISSION.md` — why the project exists and what it must not become.
2. `ROADMAP.md` — where the project is going and what milestone is next.
3. `AGENTS.md` or equivalent agent instructions — repo-specific operating rules.
4. `.osc/RULES.md` — scaffold discipline and plan/evidence rules.
5. `.osc/plans/active/` — current durable plans, if any.
6. The specific files named by the task, issue, or run packet.

## What not to do

Do not infer current truth from chat memory, runtime logs, or stale branches when the repo has explicit source-of-truth files.

Related: [[agent-resumability]], [[run-packets]], [[source-of-truth-first-development]].
