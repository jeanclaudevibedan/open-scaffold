---
title: Implementation Architecture Lens
created: 2026-05-17
updated: 2026-05-17
type: concept
tags: [open-scaffold, workflow, evidence, governance, public-boundary]
sources: [docs/RUNTIME_BINDING_CONTRACT.md, docs/SPAWNING_BOUNDARY.md, docs/SLICE_CLOSE_PROTOCOL.md, docs/REFERENCE_TRUTH.md, ROADMAP.md]
confidence: medium
contested: false
---

# Implementation Architecture Lens

The implementation architecture lens is a way to explain where Open Scaffold helps in real AI-assisted work: it strengthens the build-time protocol around workflow design, authority, evaluation, audit trails, and recovery, while leaving runtime enterprise controls to the systems and adapters that actually execute business actions.

This lens is useful because many AI projects fail outside the model call. They fail when work has no owner, no source of truth, no authority boundary, no evidence trail, or no recovery path after an agent session disappears.

## The boundary

Open Scaffold is a repo-native protocol and control plane. It is not an enterprise runtime, permission system, compliance product, or autonomous process supervisor.

```text
Open Scaffold owns build-time truth and evidence structure.
Coordinators and adapters choose and execute lanes outside core.
Systems of record own runtime data access and business authority.
Humans keep explicit approval gates for taste, risk, publication, and merge.
```

For runtime lane labels and public/private reference wording, use `docs/REFERENCE_TRUTH.md`. For execution boundaries, use `docs/RUNTIME_BINDING_CONTRACT.md` and `docs/SPAWNING_BOUNDARY.md`.

## Six-component map

| Component | Open Scaffold coverage | What Open Scaffold provides | What stays outside core |
|---|---|---|---|
| Workflow design | owned | Mission, roadmap, plans, acceptance criteria, handoff templates, run packets, and close protocol make work explicit before execution. | Domain-specific process design, stakeholder policy, and organization-specific operating procedures. |
| Data access | out of scope / system-of-record-owned | Documentation boundaries and run-packet scope can state which data must not be touched. | Runtime row/field permissions, data warehouse access, secrets, customer data controls, and system-of-record authorization. |
| Authority | partial / adapter-owned | Commit policy, approval gates, allowed paths, human-in-the-loop expectations, and plan constraints make authority visible. | Runtime sandbox enforcement, credential delegation, business-action approval, production rollback authority, and provider-specific permission models. |
| Evaluation | partial | Acceptance criteria, verification commands, evidence receipts, release notes, and PR review gates make claimed outcomes checkable. | Domain/business-rule evaluators, model benchmarks, production-quality scoring, and automated compliance judgment. |
| Audit trails | owned for repo work | Git history, plans, amendments, run packets, evidence notes, release notes, and PR links preserve why work happened and what proved it. | Tamper-evident ledgers, legal audit certification, runtime event capture from external systems, and compliance attestation. |
| Recovery / ownership | owned for project continuation | Agent-readable mission, roadmap, active plans, task/run identity, evidence, and handoff files let a human or agent resume work without vanished chat context. | Runtime session replay, live process recovery, production incident reversal, and business transaction compensation. |

## How to use the lens in plans

For future plans, the lens should answer two questions:

1. Which implementation-architecture component does this slice strengthen?
2. Which runtime, adapter, system-of-record, or human responsibility remains outside this slice?

That keeps Open Scaffold useful without letting it drift into claims it cannot prove.

Example:

```text
Implementation Architecture Coverage:
- Strengthens: evaluation, audit trails.
- Boundary: does not add model benchmarking, compliance certification, or runtime enforcement.
```

## Non-claims

This lens does not claim that Open Scaffold:

- owns runtime data permissions;
- evaluates domain-specific business correctness automatically;
- launches or supervises live agents in core;
- certifies regulated compliance;
- reverses production business actions;
- recommends models or runtimes from benchmark evidence.

Those may become adapter, evaluator, runtime, or future-product work only after explicit evidence and approval.

## Follow-up candidate

Structured acceptance-criteria evaluation, such as a future `osc eval` surface, is a separate candidate. This page only names the lens and the boundary. It does not add evaluation automation.

Related: [[source-of-truth-first-development]], [[evidence-first-development]], [[human-in-the-loop-governance]], [[run-packets]], [[agentic-orchestration]].
