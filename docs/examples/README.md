# Runtime binding examples

This directory contains small examples that make Open Scaffold mechanics concrete without turning core into an agent runtime.

`runtime-binding-dry-run.mjs` is a dependency-free reference consumer for `.osc/runs/<run_id>/run.json`. It validates the minimum fields an external binding should inspect, prints the handoff summary, and exits without launching Claude, Codex, OMC, OMX, or any other runtime.

`runtime-binding-conformance/fake-local-adapter.mjs` is a fake/local adapter conformance fixture. It consumes a run packet, writes a dispatch receipt and evidence artifact, and exits without launching a real runtime.

## Generate a run packet

From a repository checkout with dependencies installed:

```bash
npm run osc -- run .osc/plans/done/013-binding-example.md \
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

## Fake/local adapter conformance

To prove the receipt/evidence side of the boundary without a real runtime, run the fake/local adapter fixture:

```bash
node docs/examples/runtime-binding-conformance/fake-local-adapter.mjs \
  "$RUN_JSON" \
  --out "$(dirname "$RUN_JSON")/dispatch-receipt.json"
```

Expected result:

- exits `0` for an executable package;
- writes `dispatch-receipt.json` using `open-scaffold.dispatch-receipt.v1`;
- writes a deterministic evidence artifact;
- states that no runtime was launched, no credentials were read, and no network was required.

See [`runtime-binding-conformance/README.md`](runtime-binding-conformance/README.md) for the fixture boundary.

## Boundary

This example set is intentionally a **dry-run/conformance consumer**, not a launcher. Real runtime bindings, coordinators, bots, or humans may use the same `run.json` fields to launch work outside Open Scaffold core, attach runtime metadata, return evidence, and request approval.

The examples are available from the repository checkout. They are not currently advertised as packaged npm executables or a stable adapter SDK.
