# Release / Evidence Note: Runtime adapter refresh

Date: 2026-05-15

## Summary

This slice corrects Open Scaffold's runtime-adapter surface after the adapter conformance fixture shipped. It adds an explicit runtime-selection surface for OMC/OMX-style lanes, records the refreshed-adapter checklist, extends the fake/local conformance fixture to cover the documented OMC and OMX lanes, and keeps runtime launch mechanics outside Open Scaffold core.

## Traceability

- Roadmap item: `ROADMAP.md` — Milestone 9 (Runtime harness adapter refresh).
- Plan: `.osc/plans/done/009-runtime-harness-adapter-refresh.md`.
- Branch: `runtime/adapter-refresh`.
- PR: pending owner review.
- Runtime-selection artifact: `docs/RUNTIME_SELECTION.md`.
- Run packet: not generated; this was a direct documentation/conformance-fixture refresh.

## Evidence

- `docs/RUNTIME_SELECTION.md` records OMC/OMX runtime presets, workflow presets, adapter-owned launch mechanics, minimum refreshed-adapter checklist, and lane mappings.
- `src/cli.ts` accepts `--runtime omc|omx|plain|human|custom` and `--workflow interview|plan|team|loop|execute|goal|custom`.
- `src/artifacts.ts` records `runtimeSelection` in generated run packets while keeping `executor.spawning: false`.
- `docs/RUNTIME_BINDING_CONTRACT.md`, `docs/ADAPTERS.md`, and `README.md` link the runtime-selection/checklist page.
- `docs/examples/runtime-binding-conformance/fake-local-adapter.mjs` now validates the documented `omc-claude` lane in addition to existing human/plain/OMX lanes.
- `tests/runtime-binding-conformance.test.ts` adds a regression proving documented OMC and OMX lanes produce receipts/evidence while `spawned` remains false.

## Verification

Initial local verification before close:

```text
git diff --check                                      -> passed
npm test -- tests/runtime-binding-conformance.test.ts -> 15 tests passed
./verify.sh --standard                                -> 6 pass, 0 fail, 0 warn
npm run osc -- verify                                 -> PASS, 0 warnings
```

Final verification after close:

```text
./verify.sh --strict
npm run osc -- verify
npm test
npm run build
git diff --check
```

## Outcome

Ready for final verification and owner review as a focused runtime-adapter refresh PR. No runtime spawning, OMC/OMX process launch, adapter package migration, npm publish, or model/orchestration lab claim is included.

## Follow-up

- If first-class runtime adapters are created later, apply the checklist in `docs/RUNTIME_SELECTION.md` there.
- Runtime-selection and orchestration/model-lab hypotheses remain parked in `.osc/plans/backlog/030-agent-runtime-selection-vision.md` and `.osc/plans/backlog/031-agentic-orchestration-model-lab-vision.md` until adapter evidence advances further.
