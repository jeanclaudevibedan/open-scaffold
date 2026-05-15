---
title: Run Packets
created: 2026-05-15
updated: 2026-05-15
type: concept
tags: [open-scaffold, workflow, agent-orchestration, evidence]
sources: [docs/RUNTIME_BINDING_CONTRACT.md, ROADMAP.md, .osc/plans/WORKFLOW.md]
confidence: high
contested: false
---

# Run Packets

A run packet is the bounded execution contract for one attempt at a slice of work. It connects a task or plan to a runtime lane, allowed scope, verification commands, evidence destination, and approval gate.

Open Scaffold separates the work item from the execution attempt:

- `task_id` or issue ID identifies the durable work item.
- `run_id` identifies one execution attempt.
- branch and PR identify the versioned implementation path.
- evidence and release notes identify what was proven.

## What a run packet should contain

- Goal and non-goals.
- Inputs and files to inspect.
- Allowed paths and forbidden actions.
- Runtime or harness lane.
- Verification commands.
- Evidence destination.
- Human gate.

Related: [[agent-resumability]], [[evidence-first-development]], [[glass-cockpit]].
