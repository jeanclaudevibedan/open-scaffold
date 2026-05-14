# Release / Evidence Note: minimum viable scaffold

## Summary

This slice defines the smallest practical Open Scaffold adoption path and separates core downstream scaffold state from optional/deep-cut product repo artifacts.

The guide answers the post-smoke adoption question raised by the lifecycle E2E work: once the method is proven, what does a fresh project actually need to keep?

## Traceability

- Plan: `.osc/plans/backlog/025-minimum-viable-scaffold.md` before activation; `.osc/plans/done/025-minimum-viable-scaffold.md` after close.
- Guide: `docs/MINIMUM_VIABLE_SCAFFOLD.md`.
- Supporting proof: `docs/E2E_SMOKE.md` and `examples/lifecycle-e2e-smoke/`.
- Pull request: pending at time of note creation.

## Verification

Commands for this slice:

```text
./verify.sh --standard
git diff --check
```

Expected result: both commands exit 0.

## Outcome

The guide defines a five-step adoption path:

```text
mission -> one active plan -> verify -> evidence -> close
```

It also labels root-level files, `.osc/` directories, and advanced protocols as required, recommended, optional, advanced, or adapter-specific. This keeps Open Scaffold adoption lightweight while preserving the deeper protocol surface for teams that need it.
