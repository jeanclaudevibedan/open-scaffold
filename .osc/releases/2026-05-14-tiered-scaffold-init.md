# Release / Evidence Note: tiered scaffold initialization

## Summary

This slice adds a local `osc init` command that generates tiered Open Scaffold file sets for clean downstream repositories.

The initializer supports:

- `osc init --tier min --target <dir>` for the minimum viable scaffold;
- `osc init --tier standard --target <dir>` for the recommended day-one scaffold;
- `osc init --tier max --target <dir>` for the richer protocol scaffold;
- clean aliases `--min`, `--standard`, and `--max`;
- overwrite refusal by default, with `--force` available for explicit replacement.

## Traceability

- Plan: `.osc/plans/active/015-cli-packaging-ux.md` before close; `.osc/plans/done/015-cli-packaging-ux.md` after close.
- Branch: `feat/tiered-init`.
- Kanban: `t_cfcaa753` / `open-scaffold-015-tiered-init`.
- Primary implementation: `src/init.ts`, `src/cli.ts`.
- Tests: `tests/init.test.ts`, `tests/cli-init.test.ts`.
- Docs: `README.md`, `docs/MINIMUM_VIABLE_SCAFFOLD.md`, `docs/WORKFLOW.md`.
- Pull request: pending at time of note creation.

## Verification

Commands for this slice:

```text
npm test
npm run build
npm run osc -- verify
./verify.sh --standard
git diff --check
npm pack --dry-run
```

Observed result before close: all commands exited 0.

## Outcome

Fresh repos no longer need to manually copy files or decide which scaffold artifacts to keep. The tier definitions encode a small/minimum path, a normal recommended path, and an advanced path while keeping Open Scaffold core runtime-neutral and offline-capable.
