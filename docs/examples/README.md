# Runtime binding dry-run example

This directory contains small examples that make Open Scaffold mechanics concrete without turning core into an agent runtime.

`runtime-binding-dry-run.mjs` is a dependency-free reference consumer for `.osc/runs/<run_id>/run.json`. It validates the minimum fields an external binding should inspect, prints the handoff summary, and exits without launching Claude, Codex, OMC, OMX, or any other runtime.

## Generate a run packet

From a repository checkout with dependencies installed:

```bash
npm run osc -- run .osc/plans/active/013-binding-example.md \
  --task-id plan:013-binding-example-verification \
  --executor plain-agent \
  --operator-surface cli \
  --repo "$PWD" \
  --worktree "$PWD" \
  --branch "$(git branch --show-current)" \
  --commit-policy "dry-run verification only; no runtime launch"
```

This writes a new `.osc/runs/<run_id>/run.json` package. Generic Open Scaffold only creates artifacts; it does not spawn the selected lane.

## Inspect the packet like an external binding

```bash
RUN_JSON="$(ls -td .osc/runs/*/run.json | head -1)"
node docs/examples/runtime-binding-dry-run.mjs "$RUN_JSON"
```

Expected result:

- exits `0` for an executable package;
- prints run id, plan path, executor lane, optional harness skill, repo/worktree/branch, and commit policy;
- states that no runtime was launched;
- exits nonzero if the packet is not executable, has blockers, requests unsupported lanes, or violates the `spawning: false` boundary.

## Boundary

This example is intentionally a **dry-run consumer**, not a launcher. Real runtime bindings, coordinators, bots, or humans may use the same `run.json` fields to launch work outside Open Scaffold core, attach runtime metadata, return evidence, and request approval.

The example is available from the repository checkout. It is not currently advertised as a packaged npm executable or stable adapter SDK.
