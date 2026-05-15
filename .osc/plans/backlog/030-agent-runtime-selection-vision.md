# Plan: 030-agent-runtime-selection-vision

## Status

backlog — captured hypothesis, not approved implementation. 2026-05-15 three-lane sparring evidence converged on: no V1 `osc init --runtime` picker; keep runtime choice at run-packet/adapter contract level until adapter evidence exists.

## Context

The owner is exploring whether Open Scaffold v1 should evolve from a runtime-neutral repo protocol into a runtime-selection platform: users would still choose scaffold tiers such as `min`, `standard`, and `max`, but could also choose an agent runtime lane such as an external harness, a coding-agent CLI, a spec-driven framework, or an eventual Open Scaffold-native runtime.

This is a vision and validation slice, not permission to add spawning or runtime ownership by drift. It should test whether runtime choice integrates horizontally with the existing scaffold protocol and vertically with packaging, onboarding, run packets, verification, evidence, and human gates.

## Goal

Decide whether "runtime choice at initialization" belongs in the Open Scaffold v1 product vision, and if so, define the smallest safe public contract for it.

## Constraints / Out of scope

- Do not claim Open Scaffold core owns autonomous spawning today.
- Do not add real runtime launch, credentials, daemon behavior, or process supervision without a separate approved plan and safety design.
- Do not require any one runtime, vendor, harness, chat surface, or private owner setup.
- Do not market third-party runtimes as certified integrations unless they have public, reproducible adapter evidence.
- Keep private owner context out of public docs.
- Keep `MISSION.md` and current done plans unchanged unless the owner explicitly approves a mission/roadmap amendment.

## Files to touch

Likely candidates after the research verdict:

- `ROADMAP.md` — if owner approves promoting runtime choice from parking-lot hypothesis to v1 direction.
- `docs/RUNTIME_BINDING_CONTRACT.md` — define runtime selection as a contract, not implicit spawning.
- `docs/SPAWNING_BOUNDARY.md` — clarify what remains outside core.
- `docs/wiki/concepts/agent-runtime-selection.md` — compiled public-safe concept page.
- `docs/wiki/index.md` and `docs/wiki/log.md` — wiki navigation/log updates.
- `src/cli.ts` and template files — only if a later implementation slice adds `osc init --runtime <profile>` or equivalent.

## Acceptance criteria

- [ ] Three independent read-only architecture/product reviews evaluate the proposal from different lenses.
- [ ] A Hermes-owned synthesis states whether the idea is viable for v1, v1.1/v2, or only long-term research.
- [ ] The recommendation distinguishes runtime selection, adapter packaging, dispatch receipts, and native runtime ownership.
- [ ] Public docs describe the idea as a hypothesis or approved direction, not as an existing certified product capability.
- [ ] Any future implementation proposal includes verification/smoke tests for profile generation, adapter boundaries, evidence returns, and drift prevention.

## Verification steps

1. Confirm all research reports end with `REPORT_COMPLETE` or explicitly document evidence-quality caveats.
2. Run `./verify.sh --standard`; expected exit 0 before any docs PR claims completion.
3. Run `git diff --check`; expected no whitespace errors.
4. Confirm public-facing wording avoids private owner context and unsupported third-party claims.

## Open questions

- Is runtime choice a v1 release promise, a v1-compatible extension point, or a v2/native-runtime research direction?
- Should `osc init` eventually expose runtime profiles, or should runtime profiles remain separate adapter packages that consume Open Scaffold run packets?
- What makes an Open Scaffold-native runtime meaningfully different from existing harnesses: evidence guarantees, human gates, source-of-truth enforcement, auditability, or convenience spawning?
- Which third-party runtimes are public, reproducible, and stable enough to be named as examples versus kept as adapter candidates?
