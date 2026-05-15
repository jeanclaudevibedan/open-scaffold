# Release evidence: runtime docs simplification

## Summary

Simplified the public runtime narrative after runtime profiles v0 shipped. The docs now lead with the plain flow:

```text
User selects runtime
  -> Open Scaffold reads runtime profile
  -> Open Scaffold creates the run packet
  -> Adapter/coordinator launches the actual runtime
  -> Runtime does the work
  -> Evidence comes back into Open Scaffold
```

## Scope

- Plan: `.osc/plans/done/035-runtime-docs-simplification.md`
- Roadmap area: runtime selection/profile clarity and hypothesis reconciliation after PR #37
- Branch: `docs/runtime-docs-simplification`

## Traceability

- Operator task: `t_14b40621`
- Plan: `.osc/plans/done/035-runtime-docs-simplification.md`
- Run ID: not applicable; local docs slice
- PR: pending operator approval
- Evidence: this release note plus verification commands below

## Changes

- README leads with the runtime handoff flow and a shorter plain-language product story.
- Runtime docs are organized as progressive disclosure:
  1. `docs/RUNTIME_SELECTION.md` — user-facing runtime/workflow choice.
  2. `docs/RUNTIME_PROFILES.md` — built-in and project-local runtime profile data.
  3. `docs/RUNTIME_BINDING_CONTRACT.md` — adapter/coordinator execution responsibilities.
- `docs/OPEN_SCAFFOLD_SYSTEM.md` and examples route fresh readers through the same selection → profile → run packet → adapter → evidence chain.
- `ROADMAP.md` clarifies that older runtime/orchestration hypotheses are not the next implementation queue; shipped runtime selection/profile support remains non-spawning and adapter-mediated.

## Verification

- `git diff --check` — passed
- `./verify.sh --strict` — passed, 10 pass / 0 fail / 0 warn
- `npm run osc -- verify` — passed, 0 warnings
- `npm test` — passed, 8 files / 74 tests
- `npm run build` — passed
- Added-line private/secrets scan — passed
- Added-line unsupported positive-claims scan — passed

## Outcome

Public docs should be easier to read without making unsupported claims about runtime spawning, hosted registries, certified integrations, or model/task benchmarking.

## Follow-up

Future runtime work should be a concrete adapter/evidence slice, not another broad runtime vision branch. Candidate follow-up: dry-run `osc runtimes check <id>` or a conformance proof for one external adapter.
