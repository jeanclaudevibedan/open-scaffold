# Reference truth audit

Date: 2026-05-15

## Summary

Open Scaffold now has a public reference-label page for named coordinators, runtime harnesses, operator surfaces, adapter candidates, private deployment examples, and historical/unmigrated adapter repositories.

## Traceability

- Roadmap context: V2 adoption/trust hardening and external review follow-up.
- Plan: `.osc/plans/done/020-reference-truth-audit.md`
- Task: Hermes Kanban `t_57b3fbfc`
- Branch: `docs/reference-truth-audit`
- PR: [`#31`](https://github.com/graphanov/open-scaffold/pull/31)

## Changes

- Added `docs/REFERENCE_TRUTH.md` as the canonical label registry for public/private/future tool references.
- Linked the registry from README and relevant runtime/workflow docs.
- Reframed private Command Center references as owner-local/private deployment examples.
- Labeled older `jeanclaudevibedan/open-scaffold-omc` and `jeanclaudevibedan/open-scaffold-omx` links as historical/unmigrated repository references.
- Removed owner-name-specific wording from public smoke/dispatch docs where a neutral label was clearer.

## Verification

- `./verify.sh --standard`
- `npm run osc -- verify`
- `npm test`
- `npm run build`
- `git diff --check`
- Public-reference grep review for `Hermes|Claw|OpenClaw|clawhip|OMC|OMX|Daniel|Command Center|jeanclaudevibedan`

## Outcome

Public docs can continue to mention real tools and dogfood evidence while making their role explicit: examples and adapter lanes are not Open Scaffold core dependencies, and private deployment details are not adoption requirements.

## Follow-up

- `021-identity-rename-audit` can still decide whether historical adapter repositories should migrate under `graphanov` or remain explicitly labeled.
- `016-docs-positioning-compression` can use the reference-label registry to keep the first-read path short without erasing important boundaries.
