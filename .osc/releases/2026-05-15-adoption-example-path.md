# Release / Evidence Note: Adoption example path

## Summary

This bundled adoption-facing slice makes Open Scaffold easier to understand and try without private context. It adds a non-recursive downstream walkthrough, turns `docs/examples/` into a four-mode examples index, compresses the first-read positioning, and records the public identity audit outcome.

## Traceability

- Roadmap areas:
  - `ROADMAP.md` → Milestone 8 — User-facing examples.
  - `ROADMAP.md` → Milestone 13 — Non-scaffold downstream example.
  - `ROADMAP.md` → Milestone 15 — Docs compression and public positioning.
  - External-review identity hygiene item captured by plan 021.
- Task: owner-approved bundled adoption-path work item.
- Plans:
  - `.osc/plans/done/014-downstream-example-project.md`
  - `.osc/plans/done/008-user-facing-examples.md`
  - `.osc/plans/done/016-docs-positioning-compression.md`
  - `.osc/plans/done/021-identity-rename-audit.md`
- Branch: `docs/adoption-example-path`.
- Pull request: pending owner review/approval.
- Run packet: not generated; this was a direct bundled docs pass.
- Internal execution note: independent assistant lanes informed the edits, but the public evidence is the repo diff, release note, and verification results below.

## Evidence

- `docs/examples/downstream-walkthrough.md` now walks through mission → plan → implementation → verification → run packet → evidence → close on Tiny Notes, a tiny non-Open-Scaffold shell CLI fixture.
- `docs/examples/README.md` now provides four fresh-user modes: solo developer, team control-room, GitHub-only workflow, and runtime harness handoff.
- `README.md` now states what Open Scaffold is and is not near the top, links to the downstream walkthrough, and points readers to the examples index.
- `docs/FAQ.md` now explains consulting/client-delivery/compliance usefulness with explicit non-certification caveats and says when Open Scaffold is overkill.
- `docs/OPEN_SCAFFOLD_SYSTEM.md` now includes a reader path so users do not have to read every protocol page.
- `ROADMAP.md` language now generalizes private owner-local context instead of naming a private cockpit as a public requirement.
- Identity audit found no required file edits: canonical Open Scaffold references already use `graphanov/open-scaffold`; surviving `jeanclaudevibedan` adapter links are labeled historical/unmigrated.

## Verification

Commands run on 2026-05-15:

```text
git diff --check                  -> passed
npm run smoke:e2e                 -> 1 test passed
clean temp walkthrough            -> bash test.sh passed; ./verify.sh --standard passed before and after close
downstream run-packet dry-run     -> generated Tiny Notes run packet; dry-run dispatchable; generated artifacts removed
./verify.sh --strict              -> 10 pass, 0 fail, 0 warn
npm run osc -- verify             -> PASS, mission defined, 37 plan files, 0 warnings
npm test                          -> 8 files passed, 41 tests passed
npm run build                     -> passed
```

## Outcome

Ready for final verification and owner review as one bundled adoption-facing PR. Out of scope: runtime spawning, OMC/OMX adapter refresh, model/orchestration lab claims, comparison page, packaging release, and private coordinator dependencies.

## Follow-up

- Runtime adapter refresh moved forward later in `.osc/plans/done/009-runtime-harness-adapter-refresh.md`.
- CLI validation upgrades remain in `.osc/plans/backlog/007-cli-validation-upgrades.md`.
- Comparison page remains in `.osc/plans/backlog/019-comparison-page.md`.
