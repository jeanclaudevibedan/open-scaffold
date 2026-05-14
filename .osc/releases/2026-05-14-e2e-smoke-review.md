# Release / Evidence Note: E2E smoke review

## Summary

This slice promotes the 2026-05-14 four-lane Claude Code E2E review into a public strategy for Open Scaffold's lifecycle smoke testing.

The raw Claude reports remain forensic run evidence under ignored `.osc/runs/`. The durable product decision is captured in `docs/E2E_SMOKE.md`: first prove the core repo lifecycle in a fresh downstream/temp project before testing GitHub, simulated operator surfaces, real Hermes/Discord, or runtime harnesses.

## Traceability

- Plan: `.osc/plans/active/027-lifecycle-e2e-smoke-strategy.md` before close; `.osc/plans/done/027-lifecycle-e2e-smoke-strategy.md` after close.
- Evidence source: `.osc/runs/e2e-claude-4lane-20260514T160020+0200/` (ignored forensic run folder).
- Public strategy: `docs/E2E_SMOKE.md`.
- Examples link: `docs/EXAMPLES.md`.
- Pull request: pending at time of note creation.

## Four-lane review result

Hermes launched four Claude Code lanes:

1. test designer / simulation author;
2. solo developer simulator;
3. E2E result evaluator;
4. Open Scaffold product evaluator.

The supervisor exited non-zero because its postprocess Python heredoc had a quoting bug. The Claude lanes themselves completed successfully and produced valid raw JSON results. Hermes recovered markdown reports from the raw JSON `.result` fields.

Recovered evidence quality:

```text
lane-1-test-designer.md          24,431+ bytes, REPORT_COMPLETE
lane-2-solo-dev-simulator.md      8,616+ bytes, REPORT_COMPLETE
lane-3-result-evaluator.md       16,650+ bytes, REPORT_COMPLETE
lane-4-product-evaluator.md      12,217+ bytes, REPORT_COMPLETE
HERMES_SYNTHESIS.md               6,189 bytes
```

## Decision

Open Scaffold should next ship a deterministic lifecycle E2E smoke fixture. The first smoke must prove only the local core lifecycle:

```text
fresh temp/downstream project
  -> mission
  -> active plan
  -> verification
  -> evidence/release note
  -> close
  -> final verify
```

It must not require Hermes, Discord, OMC, OMX, Codex connector, GitHub PR automation, private credentials, or a new server.

## Key finding

The solo-developer simulation found a high-value adoption risk: fresh users can confuse Open Scaffold's maintainer repo state with a blank downstream project. The lifecycle smoke should therefore guard against template leakage and prove project-specific downstream state.

## Recommended next implementation PR

```text
Title: Add lifecycle E2E smoke fixture
Branch: test/lifecycle-e2e-smoke
Primary plan: .osc/plans/backlog/023-worked-downstream-example.md
```

Expected implementation deliverables:

- deterministic E2E smoke runner, likely `tests/e2e/lifecycle.test.ts`;
- fresh downstream/temp fixture;
- artifact assertions for mission, plan, evidence, close, and verification;
- update `docs/E2E_SMOKE.md` with run command and evidence;
- release/evidence note for the smoke implementation;
- close the implementation plan in the same PR if shipped.

## Verification

Commands run for this strategy slice:

```text
./verify.sh --standard -> expected pass
git diff --check       -> expected pass
```

## Outcome

The four-lane review has been distilled into a public strategy contract. The next PR should implement the deterministic lifecycle smoke, not debate whether the first smoke should include Discord/Hermes/runtime integrations.
