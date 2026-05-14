# Release / Evidence Note: lifecycle E2E smoke fixture

## Summary

This slice ships the first deterministic Open Scaffold lifecycle E2E smoke. The smoke proves a tiny downstream project can move through mission, active plan, project verification, evidence note, close, and final scaffold verification without Hermes, Discord, runtime harnesses, GitHub automation, private credentials, or network access.

## Traceability

- Plan: `.osc/plans/active/023-worked-downstream-example.md` before close; `.osc/plans/done/023-worked-downstream-example.md` after close.
- Strategy source: `docs/E2E_SMOKE.md`.
- Fixture: `examples/lifecycle-e2e-smoke/`.
- Test: `tests/e2e/lifecycle.test.ts`.
- Command: `npm run smoke:e2e`.
- Pull request: pending at time of note creation.

## Verification

Commands for this slice:

```text
npm run smoke:e2e
npm test
npm run build
./verify.sh --standard
git diff --check
```

Expected result: all commands exit 0.

## Outcome

The smoke copies the tiny fixture into a fresh temp directory, copies `verify.sh` and `close.sh` into that downstream project, runs the fixture's behavior test, writes a release/evidence note, closes the active plan, asserts the done/active folder state, verifies the mission changelog, and runs final scaffold verification.

This is core lifecycle proof only. GitHub, simulated operator-surface, real Hermes/Discord, and runtime-harness smokes remain future layers.
