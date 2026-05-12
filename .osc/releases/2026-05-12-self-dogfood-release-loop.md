# Release / Evidence Note: Self-dogfood release loop v1

Date: 2026-05-12

## Summary

Open Scaffold demonstrated its own public product workflow: ROADMAP Milestone 6 became a GitHub issue, a scaffold plan, a generated run packet, a branch/PR, a Codex-review attempt, local verification, and this release/evidence note.

## Traceability chain

```text
ROADMAP.md Milestone 6 — Self-dogfood release loop
  -> GitHub issue #8
  -> .osc/plans/done/005-self-dogfood-release-loop.md
  -> run_id 20260512T135850Z-005-self-dogfood-release-loop-run
  -> branch docs/self-dogfood-release-loop
  -> PR #9
  -> verification: local commands passed before PR creation
  -> merge/release: PR #9 merged; issue #8 closed
```

## Work item

- Issue: https://github.com/jeanclaudevibedan/open-scaffold/issues/8
- Task ID: `issue:8`
- Plan: `.osc/plans/done/005-self-dogfood-release-loop.md`
- Run ID: `20260512T135850Z-005-self-dogfood-release-loop-run`
- Generated run packet: `.osc/runs/20260512T135850Z-005-self-dogfood-release-loop-run/run.json` (gitignored generated artifact; summarized here for durable public reconstruction)
- Executor lane: `plain-agent`
- Harness skill: `none`
- Operator surface: `github`
- Branch: `docs/self-dogfood-release-loop`
- PR: https://github.com/jeanclaudevibedan/open-scaffold/pull/9

## Run packet summary

The generated run packet records:

- schema: `open-scaffold.run.v1`
- status: `created`
- package quality: executable, no blockers
- executor: `plain-agent`, `spawning: false`
- GitHub issue binding: `8`
- commit policy: commit/push/merge allowed by Daniel instruction for this Ralph loop; Open Scaffold core still does not spawn runtimes

The `.osc/runs/` directory remains ignored because run packets are generated execution artifacts. This note promotes the important public facts back into tracked repo evidence.

## Verification

Local verification for this slice passed before PR creation:

```text
./verify.sh --standard        -> 4 pass, 0 fail, 0 warn
npm run osc -- verify         -> PASS mission defined and 9 plan file(s) found
npm test                      -> 2 files / 6 tests passed
npm run build                 -> TypeScript build passed
git diff --check              -> passed
leakage scan                  -> no private paths/secrets hits
```

## Codex review status

```text
@codex review triggered on PR #9.
Codex connector initially requested environment setup, then completed review and reported: "Didn't find any major issues. :+1:"
```

## Outcome

```text
PR #9 merged. GitHub issue #8 closed. Milestone 6 v1 proof chain is complete.
```

## Follow-up

- Consider a future `osc release-note` helper that summarizes issue, plan, run packet, PR, verification, and Codex status into this format.
- Consider whether `.osc/releases/` should be formalized in the scaffold default tree or remain an optional convention.
