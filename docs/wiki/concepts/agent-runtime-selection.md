---
title: Agent Runtime Selection
created: 2026-05-15
updated: 2026-05-15
type: concept
tags: [open-scaffold, runtime, agent-orchestration, product-vision]
sources: [MISSION.md, ROADMAP.md, docs/RUNTIME_BINDING_CONTRACT.md, docs/SPAWNING_BOUNDARY.md, .osc/plans/backlog/030-agent-runtime-selection-vision.md]
confidence: medium
contested: true
---

# Agent Runtime Selection

Agent runtime selection is the product hypothesis that an Open Scaffold user should eventually choose not only a scaffold tier, but also the runtime lane that will execute work against the scaffold.

The tier answers: "how much durable project structure do I want?"

The runtime selection answers: "what execution system should consume the plan/run/evidence contract?"

Potential runtime lanes include:

- a human terminal;
- a coding-agent CLI;
- an external workflow harness;
- a spec-driven agent framework;
- a future Open Scaffold-native runtime.

## Why it fits the body of work

Open Scaffold already separates durable repo truth from live execution. That separation creates a natural seam for runtime choice:

1. The repository stores mission, roadmap, plans, run packets, evidence, and gates.
2. A runtime lane consumes a bounded package of work.
3. The runtime returns status, artifacts, blockers, and evidence.
4. Human approval decides whether the slice closes.

If this seam is made explicit, Open Scaffold can stay runtime-neutral while becoming more useful as the integration layer between repo-native discipline and the fast-changing agent-runtime market.

## The hard boundary

Runtime selection is not the same as runtime ownership.

A safe v1-compatible version can define:

- runtime profile metadata;
- adapter expectations;
- dispatch receipts;
- evidence-return contracts;
- human-gate requirements;
- smoke tests that prove a runtime lane does not become hidden source of truth.

A riskier version would add:

- process spawning;
- credentials;
- long-running supervision;
- native task queues;
- automatic commit/push/merge behavior;
- provider-specific execution semantics.

Those belong behind explicit design decisions, safety analysis, and separate implementation plans.

## Open question for V1

The live product question is whether runtime choice should become:

1. a v1 release promise;
2. a v1 public extension point with no built-in spawning;
3. a v1.1/v2 implementation track;
4. a long-term native-runtime research direction.

## Current scaffold stance

As of 2026-05-15, runtime selection in `osc init` is not a v1 release promise. Open Scaffold core remains runtime-neutral by design; runtime adapters belong in downstream packages or external lanes that consume the existing run packet and binding contract.

This page records the hypothesis so it can be tested instead of lost in chat. It should not be read as a commitment to ship a runtime picker, certify third-party runtimes, or make Open Scaffold core responsible for spawning.

The strongest version of the idea is not "Open Scaffold runs every agent." It is:

> Open Scaffold gives every agent runtime the same source-of-truth-first contract for planning, execution, evidence, and handback.

Related: [[run-packets]], [[repo-native-agent-operating-system]], [[source-of-truth-first-development]], [[human-in-the-loop-governance]], [[scaffold-tiers]].
