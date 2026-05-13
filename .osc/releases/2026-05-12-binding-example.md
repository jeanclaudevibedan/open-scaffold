# Release / Evidence Note: Minimal runtime binding dry-run example

## Summary

This slice implements the first public runtime-binding proof from the independent-review roadmap: a dependency-free dry-run consumer for `.osc/runs/<run_id>/run.json`.

The example validates the generated run packet, prints the handoff summary an external binding would use, and exits without launching Claude, Codex, OMC, OMX, or any other runtime. This makes the runtime binding contract concrete while preserving Open Scaffold core's non-spawning boundary.

## Traceability

- Roadmap milestone: `ROADMAP.md` → Milestone 12 — Minimal runtime binding example.
- Plan: `.osc/plans/active/013-binding-example.md` before close; `.osc/plans/done/013-binding-example.md` after close.
- Pull Request: PR #14 — https://github.com/graphanov/open-scaffold/pull/14.
- RALPLAN run packet: `.osc/runs/20260512T211904Z-013-binding-example-run/run.json`.
- ULTRAWORK run packet: `.osc/runs/20260512T213342Z-013-binding-example-run/run.json`.
- Public docs:
  - `docs/examples/README.md`
  - `docs/examples/runtime-binding-dry-run.mjs`
  - `docs/RUNTIME_BINDING_CONTRACT.md`
  - `README.md`

## Verification

Commands run after implementation:

```text
npm run osc -- run .osc/plans/done/013-binding-example.md \
  --task-id plan:013-binding-example-verification \
  --executor plain-agent \
  --operator-surface cli \
  --repo "$PWD" \
  --worktree "$PWD" \
  --branch "$(git branch --show-current)" \
  --commit-policy "dry-run verification only; no runtime launch"

node docs/examples/runtime-binding-dry-run.mjs "$RUN_JSON" -> passed; printed dry-run handoff and no-runtime-launch statement
./verify.sh --strict                                  -> 9 pass, 0 fail, 1 warn in git worktree; warning is the known worktree `.git` file limitation of the immutability check
npm test                                             -> 4 files, 12 tests passed
npm run build                                        -> passed
npm audit                                            -> found 0 vulnerabilities
git diff --check                                     -> passed
```

## OMX dogfood notes

- `$ralplan` produced a useful planner/architect/critic consensus recommending a runtime-neutral dry-run adapter first.
- The OMX leader stalled after substantive planning evidence was present; Hermes killed the stale wrapper and promoted recovered RALPLAN evidence.
- `$ultrawork` correctly attempted implementation but ran in a read-only/temp-restricted sandbox and reported `BLOCKED`; Hermes took over implementation and verification from the recovered plan.

## Outcome

Milestone 12 is complete: a fresh user can generate a run packet and inspect how an external binding would consume it, without core becoming a runtime launcher. Runtime-specific adapters remain future work under the adapter-refresh/backlog path.
