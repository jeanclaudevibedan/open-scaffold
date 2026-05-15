# Release / Evidence Note: Public trust and readiness bundle

## Summary

This bundled slice strengthens Open Scaffold's public trust surface: validation catches more evidence/state drift, packaging readiness has a scannable diagram/checklist, and readers get an honest comparison page for adjacent AI workflow systems.

## Traceability

- Roadmap areas:
  - `ROADMAP.md` → Milestone 7 — CLI validation upgrades.
  - `ROADMAP.md` → Milestone 10 — Product packaging and releases.
  - External-review comparison-page item captured by plan 019.
- Task: owner-approved public trust/readiness bundled work item.
- Plans:
  - `.osc/plans/done/007-cli-validation-upgrades.md`
  - `.osc/plans/done/010-product-packaging-release.md`
  - `.osc/plans/done/019-comparison-page.md`
- Branch: `product/trust-readiness-bundle`.
- Pull request: pending owner review/approval.
- Run packet: not generated; this was a direct bundled implementation/docs pass.

## Evidence

- `src/validation.ts` now warns on additional drift classes:
  - release notes whose Traceability section does not cite a `.osc/plans/` path;
  - empty/placeholder release-note Verification or Outcome sections;
  - duplicated active/done plan slugs;
  - active plans with matching release notes;
  - evidence receipts missing `schema: open-scaffold.evidence.v1` or `approval.status`.
- `tests/validation.test.ts` adds regression coverage for the new validation warnings.
- `package-lock.json` now matches the existing `package.json` Node engine range.
- `docs/WHY_OPEN_SCAFFOLD.md` adds a scannable diagram story: problem, loop, boundary, and fit.
- `.osc/releases/2026-05-15-packaging-release-readiness.md` records packaging/release readiness without claiming a new npm publish.
- `docs/COMPARISON.md` gives an orientation comparison against spec-kit, BMAD, and Agent OS with explicit caveats and no benchmark claims.
- `README.md` links to the why-this-exists doc and comparison page.
- `.osc/releases/2026-05-12-v0.3.0-runtime-neutral-baseline.md` was patched to cite the relevant plan path so the new validator remains clean on current repo truth.

## Verification

Commands run on 2026-05-15 before PR creation:

```text
git diff --check                  -> passed
./verify.sh --strict              -> 10 pass, 0 fail, 0 warn
npm run osc -- verify             -> PASS, mission defined, 37 plan files, 0 warnings
npm test                          -> 8 files passed, 49 tests passed
npm run build                     -> passed
npm pack --dry-run                -> passed; 134 files; no .osc/runs or .osc/research paths
```

## Outcome

Ready for final verification and owner review as one bundled public trust/readiness PR. Out of scope: runtime spawning, OMC/OMX adapter refresh, model/orchestration lab claims, mission rewrite, npm-registry publishing, and editing completed plan content.

## Follow-up

- Runtime harness adapter refresh remains in `.osc/plans/backlog/009-runtime-harness-adapter-refresh.md`.
- Runtime-selection and orchestration/model-lab hypotheses remain parked in `.osc/plans/backlog/030-agent-runtime-selection-vision.md` and `.osc/plans/backlog/031-agentic-orchestration-model-lab-vision.md` until adapter evidence advances.
