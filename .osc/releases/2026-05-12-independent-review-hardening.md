# Release / Evidence Note: Independent review hardening pass

## Summary

This slice implemented the first source-grounded hardening items from the 2026-05-12 independent review. It kept Open Scaffold core runtime-neutral while making the trust surface cleaner: `verify.sh --quick` is minimal again, dependency audit is clean, and local OMC/OMX runtime state is ignored alongside other agent/runtime state.

## Traceability

- Roadmap milestone: `ROADMAP.md` → Milestone 11 — Independent review hardening.
- Plan: `.osc/plans/active/012-independent-review-hardening.md` before close; `.osc/plans/done/012-independent-review-hardening.md` after close.
- Review-roadmap evidence note: `.osc/releases/2026-05-12-independent-review-roadmap.md`.
- Related prior hotfix: `.osc/plans/done/011-codex-pr10-verify-feedback.md`.

## Verification

Commands run after implementation:

```text
./verify.sh --quick      -> 2 pass, 0 fail, 0 warn
./verify.sh --standard   -> 6 pass, 0 fail, 0 warn
./verify.sh --strict     -> 10 pass, 0 fail, 0 warn
npm test                 -> 3 files, 9 tests passed on vitest 4.1.6
npm run build            -> passed
npm audit                -> found 0 vulnerabilities
git diff --check         -> passed
```

Finding classification:

- Confirmed and fixed: `verify.sh --quick` was running release/stale checks, undercutting progressive disclosure. Those checks now run only for `--standard` and `--strict`.
- Confirmed and fixed: npm audit reported moderate advisories through the old Vitest/Vite toolchain. `vitest` was upgraded to `^4.1.6`; audit is clean.
- Confirmed and fixed as hygiene: local OMC/OMX runtime directories should not become public scaffold truth. `.omc/` and `.omx/` are now ignored with other agent/runtime state.
- Already fixed by PR #11: GNU/BSD `stat` fallback ordering and plan immutability edit-count behavior.
- Preserved boundary: Open Scaffold core still does not spawn runtimes.

## Outcome

Milestone 11 is complete as a small hardening pass. The remaining independent-review direction stays in backlog: minimal binding example, downstream example, CLI/packaging UX, and docs compression/public positioning.
