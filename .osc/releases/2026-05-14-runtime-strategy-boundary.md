# Release / Evidence Note: Runtime strategy boundary

## Summary

This slice closes the Milestone 16 runtime strategy discovery loop. Open Scaffold core remains non-spawning for now: it packages work, records plans/run packets/evidence, and defines the adapter/runtime boundary. Real execution belongs in runtime-specific adapters, external harnesses, or a future explicitly governed runtime product.

PR #17 captured the decision-grade research synthesis. PR #18 converted that research into an explicit spawning boundary and adapter contract vocabulary. PR #19 completed repository-owner documentation hygiene after the repo transfer.

## Traceability

- Roadmap milestone: `ROADMAP.md` → Milestone 16 — Runtime strategy and native-runtime exploration.
- Plan: `.osc/plans/active/017-runtime-strategy-native-runtime-exploration.md` before close; `.osc/plans/done/017-runtime-strategy-native-runtime-exploration.md` after close.
- Pull Request: PR #17 — https://github.com/graphanov/open-scaffold/pull/17.
- Pull Request: PR #18 — https://github.com/graphanov/open-scaffold/pull/18.
- Repository-owner docs hygiene: PR #19 — https://github.com/graphanov/open-scaffold/pull/19.
- Public docs:
  - `docs/RUNTIME_STRATEGY_RESEARCH_CRITERIA.md`
  - `docs/RUNTIME_STRATEGY_RESEARCH_EVIDENCE.md`
  - `docs/RUNTIME_STRATEGY_RESEARCH_SYNTHESIS.md`
  - `docs/SPAWNING_BOUNDARY.md`
  - `docs/RUNTIME_BINDING_CONTRACT.md`

## Decision

Near term, Open Scaffold core should not implement real autonomous runtime spawning.

Core should define vendor-neutral run packets, adapter/runtime contract vocabulary, dispatch receipts, authority policy, failure taxonomy, evidence expectations, and human approval boundaries. If `osc spawn` is explored later, the first implementation should be fake/local and receipt-only before any real Claude/Codex/OpenCode/OMC/OMX/Ouroboros mutation path exists.

In one sentence:

> Open Scaffold should be the repo-native contract and black-box recorder that any runtime can consume, not the runtime itself — at least until a separate, explicitly governed runtime product has a stronger reason to exist than the current adapter ecosystem already provides.

## Verification

Post-hygiene verification commands run on 2026-05-14:

```text
git diff --check     -> passed
./verify.sh --strict -> 10 pass, 0 fail, 0 warn
npm test             -> 4 files passed, 13 tests passed
npm run build        -> passed
```

No commit, push, PR creation, or merge was performed as part of this hygiene pass.

## Outcome

Milestone 16 is complete as a discovery/boundary slice. Future runtime work should be scoped as explicit follow-up product slices rather than reopening the broad strategy question from zero.
