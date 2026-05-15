---
title: Agent Resumability
created: 2026-05-15
updated: 2026-05-15
type: concept
tags: [open-scaffold, agent-orchestration, source-of-truth, workflow]
sources: [ROADMAP.md, docs/SLICE_CLOSE_PROTOCOL.md, docs/WORKFLOW.md]
confidence: high
contested: false
---

# Agent Resumability

Agent resumability is the ability for a capable agent or orchestrator to re-enter a project, reconstruct the relevant state, and continue bounded work without depending on the previous chat session.

In Open Scaffold, resumability comes from explicit artifacts rather than model memory:

- `MISSION.md` says what matters.
- `ROADMAP.md` says what direction is next.
- `.osc/plans/` says what a slice is trying to accomplish.
- `.osc/runs/` records an execution attempt.
- evidence and release notes say what actually happened.
- `docs/wiki/` explains durable concepts that should not be re-derived.

## Good resumability

A resumed agent should be able to answer:

1. What is the goal?
2. What is in scope and out of scope?
3. What files are safe to touch?
4. What verification proves the slice?
5. What human gate still exists?

## Anti-pattern

If a project can only resume because one person remembers a chat thread, the project is not source-of-truth-first.

Related: [[source-of-truth-first-development]], [[evidence-first-development]], [[what-should-agents-read-first]].
